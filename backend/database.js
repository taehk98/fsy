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

async function setAdminToken(id, token) {
    return await userCollection.updateOne(
        { id: id },
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

async function insertActivity(activityName) {
    try {
        const updateResult = await scoresCollection.updateMany(
            {},
            {
                $set: { [`activities.${activityName}`]: 0}
            }
        )
        console.log('Update Result:', updateResult);
        console.log(`Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`);
        const insertResult = await activityListCollection.updateOne(
            { _id: new ObjectId("664986b19214e7b98f93f3de") },
            {
              $push: {
                activities: activityName
              }
            }
        );
        return await getActivityList();
    } catch (error) {
        console.error('Error updating documents:', error);
    }
}

async function deleteActivity(activityName) {
    try {
        let result = await scoresCollection.updateMany(
            { "activities": { $exists: true } }, // Ensure activities field exists
            { $unset: { [`activities.${activityName}`]: "" } }
        );

        if (result.modifiedCount === 0) {
            console.log("here");
            throw new Error(`activities 필드를 못찾았습니다: ${activityName}`);
        }

        result = await activityListCollection.updateOne(
            { _id: new ObjectId("664986b19214e7b98f93f3de") },
            {
                $pull: {
                    activities: activityName
                }
            }
        );
        if (result.modifiedCount === 0) {
            console.log("here");
            throw new Error(`activities 필드를 못찾았습니다: ${activityName}`);
        }
      return await getActivityList();
    } catch (error) {
        throw new Error('활동 삭제에 실패했습니다.');
    }
}

async function deleteMultipleActivities(activityNames) {
    try {
        for (let i = 0; i < activityNames.length; i++) {
            
            let result = await scoresCollection.updateMany(
                { "activities": { $exists: true } }, // Ensure activities field exists
                { $unset: { [`activities.${activityNames[i]}`]: "" } }
            );

            if (result.modifiedCount === 0) {
                throw new Error(`activities 필드를 못찾았습니다: ${activityNames[i]}`);
            }

            result = await activityListCollection.updateOne(
                { _id: new ObjectId("664986b19214e7b98f93f3de") },
                {
                    $pull: {
                        activities: activityNames[i]
                    }
                }
            );
            if (result.modifiedCount === 0) {
                throw new Error(`activities 필드를 못찾았습니다: ${activityNames[i]}`);
            }
        }
      return await getActivityList();
    } catch (error) {
        throw new Error('활동 삭제에 실패했습니다.');
    }
  }

async function deleteTeam(teamID) {
    try {
      const result = await scoresCollection.deleteOne({ _id: new ObjectId(teamID) });
      // 재시도 로직 추가
      if (result.deletedCount === 0) {
        // console.warn(`Document not found on first try for _id: ${teamID}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
        result = await scoresCollection.deleteOne({ _id: new ObjectId(teamID) });
    }

    if (result.deletedCount === 0) {
        console.error(`해당 조를 찾지 못했습니다: ${teamID}`);
        throw new Error(`해당 조를 찾지 못했습니다: ${teamID}`);
    }
      return await initialScores();
    } catch (error) {
        throw new Error('팀들 삭제에 실패했습니다.');
    }
  }

async function deleteMultipleTeams(teamIDs) {
    try {
        for (let i = 0; i < teamIDs.length; i++) {
            let objectId;
            try {
                objectId = new ObjectId(teamIDs[i]);
            } catch (error) {
                console.error(`Invalid ObjectId: ${teamIDs[i]} - ${error.message}`);
                throw new Error(`Invalid ObjectId: ${teamIDs[i]}`);
            }

            const result = await scoresCollection.deleteOne({ _id: objectId });
             // 재시도 로직 추가
             if (result.deletedCount === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                result = await scoresCollection.deleteOne({ _id: objectId });
            }

            if (result.deletedCount === 0) {
                console.error(`해당 조를 찾지 못했습니다: ${teamIDs[i]}`);
                throw new Error(`해당 조를 찾지 못했습니다: ${teamIDs[i]}`);
            }
        }
        return await initialScores();
    } catch (error) {
        console.error(`팀들 삭제에 실패했습니다: ${error.message}`);
        throw new Error('팀들 삭제에 실패했습니다.');
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

module.exports = {
    getUser,
    getUserByToken,
    setAdminToken,
    getActivityList,
    initialScores,
    insertTeam,
    updateAttendances,
    replaceAttentances,
    getAdmin,
    deleteTeam,
    deleteMultipleTeams,
    insertActivity,
    deleteActivity,
    deleteMultipleActivities
};