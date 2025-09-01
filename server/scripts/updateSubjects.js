const { db } = require("../config/firebase");

// Update existing subjects with missing fields
async function updateSubjects() {
  console.log("🔄 Updating existing subjects...");

  try {
    const subjectsSnapshot = await db.collection("subjects").get();

    for (const doc of subjectsSnapshot.docs) {
      const subjectData = doc.data();
      const updates = {};

      // Add missing fields if they don't exist
      if (!subjectData.avgTime) {
        switch (subjectData.name) {
          case "Mathematics":
            updates.avgTime = 20;
            updates.totalQuizzes = 5;
            break;
          case "Science":
            updates.avgTime = 15;
            updates.totalQuizzes = 3;
            break;
          case "History":
            updates.avgTime = 18;
            updates.totalQuizzes = 4;
            break;
          case "Literature":
            updates.avgTime = 22;
            updates.totalQuizzes = 6;
            break;
          case "Programming":
            updates.avgTime = 25;
            updates.totalQuizzes = 8;
            break;
          default:
            updates.avgTime = 20;
            updates.totalQuizzes = 5;
        }

        updates.updatedAt = new Date();

        await db.collection("subjects").doc(doc.id).update(updates);
        console.log(`✅ Updated subject: ${subjectData.name}`);
      } else {
        console.log(
          `ℹ️ Subject ${subjectData.name} already has required fields`
        );
      }
    }

    console.log("🎉 Subject updates completed!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Error updating subjects:", error);
    process.exit(1);
  }
}

// Run the update if this file is executed directly
if (require.main === module) {
  updateSubjects();
}

module.exports = { updateSubjects };
