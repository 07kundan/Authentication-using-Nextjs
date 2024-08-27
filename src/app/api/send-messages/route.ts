import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, content } = await req.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    // is user accepting messages or not
    if (!user?.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user isn't accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, created_at: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "failed sending message",
      },
      {
        status: 500,
      }
    );
  }
}
