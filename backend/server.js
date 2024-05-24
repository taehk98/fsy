const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const DB = require('./database.js');
const cors = require('cors');
const axios = require("axios");
const path = require("path");
// const { peerProxy } = require('./peerProxy.js');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';
let scores = [];
let userID = '';


app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

app.use(express.static('frontend'));
//app.use(express.static('public'));

app.use(cors());

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
  });

//http://api.football-data.org/v4/competitions/PL/standings 프리미어리그 순서 가져오는 api endpoint

// apiRouter.post('/auth/create', async (req, res) => {
//     if (await DB.getUser(req.body.email)) {
//       res.status(409).send({ msg: 'Existing user' });
//     } else {
//         attendances = await DB.initialClubAttds(req.body.club, attendances);
//         const user = await DB.createUser(req.body.email, req.body.password, req.body.name, req.body.club);
//         attendances = await addUserToAttds(req.body.email, attendances);
//         // Set the cookie
//         setAuthCookie(res, user.token);
  
//         res.send({ name: req.body.name, club: req.body.club });
//     }
// });

apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getAdmin(req.body.id);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
        scores = await DB.initialScores();
        const accessToken = uuidv4();
        setAuthCookie(res, accessToken);
        await DB.setAdminToken(req.body.id, accessToken);
        userID = req.body.id;
        res.status(200).send({ scores: scores, access_token: accessToken, id: userID });
        // 호출 시 외부의 attendances 변수를 업데이트함
        return;
        }
    }
    res.status(401).send({ msg: `로그인 실패: 아이디 또는 비밀번호를 \n다시 확인해주세요.` });
});

  // DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', async (_req, res) => {
    res.clearCookie(authCookieName);
    userID = null;
    res.status(204).end();
});

apiRouter.get('/get-scores', async (req, res) => {
    try {
        const scores = await DB.initialScores();
        authToken = await req.cookies[authCookieName];
        authToken = authToken ? authToken : null;
        userID = userID ? userID : null;
        res.status(200).send({ scores: scores, access_token: authToken, id: userID })
    }
    catch {
        res.status(400).end();
    }
})

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
authToken = req.cookies[authCookieName];
const user = await DB.getUserByToken(authToken);
if (user) {
    next();
} else {
    res.status(401).send({ msg: 'Unauthorized' });
}
});

secureApiRouter.get('/get-activityList', async (req, res) => {
    const activities = await DB.getActivityList();
    
    res.send(activities);
});

secureApiRouter.post('/insert-team', async (req, res) => {
    try {
        authToken = req.cookies[authCookieName];
        const scores = await DB.insertTeam(req.body);
        res.status(200).send({scores: scores , access_token: authToken , id: 'admin'});
    } catch(err) {
        res.status(400)
    }
});

secureApiRouter.delete('/delete-team/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const scores = await DB.deleteTeam(id);
        authToken = req.cookies[authCookieName];
        res.status(200).send({scores: scores , access_token: authToken , id: 'admin'});
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to delete the document');
    }
});

secureApiRouter.delete('/delete-multiple-teams', async (req, res) => {
    const teamIDs = req.body;
    try{
        const scores = await DB.deleteMultipleTeams(teamIDs);
        authToken = req.cookies[authCookieName];
        res.status(200).send({scores: scores, access_token: authToken , id: 'admin'});
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to delete the document');
    }
})

secureApiRouter.delete('/delete-multiple-activities', async (req, res) => {
    const activityNames = req.body;
    try{
        const activityList = await DB.deleteMultipleActivities(activityNames);
        authToken = req.cookies[authCookieName];
        res.status(200).send({activityList: activityList , access_token: authToken , id: 'admin'});
    }catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to delete the document');
    }
})

secureApiRouter.post('/insert-activity', async (req, res) => {
    try {
        authToken = req.cookies[authCookieName];
        const activityList = await DB.insertActivity(req.body.activityName);
        res.status(200).send({access_token: authToken , id: 'admin', activityList: activityList });
    } catch(err) {
        res.status(400).send(err.message);
    }
});

secureApiRouter.delete('/delete-activity/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const activityList = await DB.deleteActivity(id);
        authToken = req.cookies[authCookieName];
        res.status(200).send({activityList: activityList , access_token: authToken , id: 'admin'});
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to delete the document');
    }
});

///////////////////////////////////////////// manageyourclub below

//used for one attendance change
secureApiRouter.post('/save-attendance', async (req, res) => {
    await DB.updateAttendances(req.body, attendances);
    attendances = await DB.initialClubAttds(req.body.club, attendances);
    res.send(attendances);
})

// used for 
secureApiRouter.post('/replace-attendances', async (req, res) => {
    attendances = await DB.replaceAttentances(req.body, attendances);
    attendances = await DB.initialClubAttds(req.body.club, attendances);
    res.send(attendances);
})

secureApiRouter.post('/attendances', async (req, res) => {
    try {
        const user = await DB.getAttendance(req.body.email);
        const updatedAttendances = await DB.initialClubAttds(user.club, attendances);
        res.send(updatedAttendances);
    } catch (error) {
        console.error('Error while fetching attendances:', error);
        res.status(500).json({ error: 'Failed to fetch attendances' });
    }
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../frontend') });
  });

const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

// peerProxy(httpService);

async function addUserToAttds(email, attendances) {
    const attd = await DB.getAttendance(email);
    if (attd) {
        if (!attendances) {
            attendances = []; // 만약 비어있으면 빈 배열을 생성합니다.
        }
        attendances.push(attd);
    } else {
        console.error(`Attendance information not found for email: ${email}`);
    }
    return attendances;
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }
