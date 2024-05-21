const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

// connecting mongodb
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('fsy');
const teamsCollection = db.collection('teams');
const scoresCollection = db.collection('scores');
const userCollection = db.collection('admin');
const activityListCollection = db.collection('activityList');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

async function initialScores() {
    try {
        const allDocuments = await scoresCollection.find({}).toArray();
        // 업데이트된 attendances를 외부로 반환
        scores = allDocuments;
        return scores;
    } catch (err) {
        console.error('Failed to fetch documents from the collection:', err);
        return;
    }
}

async function setAdminToken(token) {
    return await userCollection.updateOne(
        { id: "admin" },
        { $set: { token: token } }
    );
}

async function getUser(email) {
    return await userCollection.findOne({ email: email });
  }
  
async function getUserByToken(token) {
    return await userCollection.findOne({ token: token });
}

async function getAdmin(userId) {
    return await userCollection.findOne({ id: userId });
}

async function getActivityList() {
    return await activityListCollection.find({}).toArray();
}

async function insertTeam(team) {
    try {
        // 팀 이름 중복 확인
        const existingTeam = await scoresCollection.findOne({ teamName: team.teamName });
        if (existingTeam) {
            throw new Error('팀 이름이 이미 존재합니다.');
        }
        await scoresCollection.insertOne(team);
        return await initialScores();
    } catch (err) {
        console.error('Failed to add the team', err);
        return;
    }
}

// async function createUser(email, password, name, club) {
//     // Hash the password before we insert it into the database
//     const passwordHash = await bcrypt.hash(password, 10);
//     const token = uuid.v4();
//     const user = {
//       email: email,
//       password: passwordHash,
//       token: token
//     };
//     await userCollection.insertOne(user);
//     await collection.insertOne(newAttendance);
  
//     return user;
//   }

  // updates one attendance
async function updateAttendances(newAttendance, attendances) {
    let dbUser = await collection.findOne({email:newAttendance.email});
            await collection.replaceOne(
                {_id: new ObjectId(dbUser._id)},
                newAttendance
            )
    attendances = await initialClubAttds(newAttendance.club, attendances);

    return attendances;
}

// updates many attendances at once
async function replaceAttentances(newAttendances, attendances) {
    for(let i = 0; i < newAttendances.length; i++) {
        let dbUser = await collection.findOne({email: newAttendances[i].email});
        if (dbUser) {
            const newAttendance = {
                name: newAttendances[i].name,
                club: newAttendances[i].club, 
                willAttend: newAttendances[i].willAttend, 
                actualAtt: newAttendances[i].actualAtt, 
                attNum: newAttendances[i].attNum, 
                notAttNum: newAttendances[i].notAttNum,
                fakeAttNum: newAttendances[i].fakeAttNum,
                password: newAttendances[i].password,
                email: newAttendances[i].email,
                token: newAttendances[i].token
            };
            await collection.replaceOne(
                {_id: new ObjectId(dbUser._id)},
                newAttendance
            );
        }else {
            await collection.insertOne(newAttendances);
        }
    }
    return attendances;
}

async function updateScoresByActivity(activityId, teamId, newScore) {
    try {
        const team = await scoresCollection.findOne({ teamName: teamId });
        console.log(team)
        if (!team) {
            throw new Error('Team not found');
        }

        // Update the activity score
        team.activities[activityId] = newScore;

        // Recalculate total score
        team.totalScore = Object.values(team.activities).reduce((total, score) => total + score, 0);

        // Update the document in the database
        await scoresCollection.updateOne(
            { _id: new ObjectId(teamId) },
            { $set: { activities: team.activities, totalScore: team.totalScore } }
        );

        // Return the updated scores
        return await initialScores();
    } catch (err) {
        console.error('Failed to update scores by activity:', err);
        throw err;
    }
}

module.exports = {
    getUser,
    getUserByToken,
    setAdminToken,
    getActivityList,
    initialScores,
    insertTeam,
    updateScoresByActivity,
    updateAttendances,
    replaceAttentances,
    getAdmin
};