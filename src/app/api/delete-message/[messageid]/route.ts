import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "message already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while deleting message", error);
    return Response.json(
      {
        success: false,
        message: "message deleted failed",
      },
      { status: 500 }
    );
  }
}
