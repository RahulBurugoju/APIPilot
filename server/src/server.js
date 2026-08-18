import "dotenv/config"
import app from "./app.js"
import connectDb from "./db/connectDb.js"

const PORT = process.env.PORT || 9000

const startServer = async ()=>{
try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`APIPilot server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
