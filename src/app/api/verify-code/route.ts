import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    // optional
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeVerify = user.verifyCode === code;
    const isNotExpiredCode = new Date(user.verigyCodeExpiry) > new Date();

    if (isCodeVerify && isNotExpiredCode) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isNotExpiredCode) {
      return Response.json(
        {
          success: false,
          message: "verification code expired",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid Code",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "user verification failed",
      },
      {
        status: 500,
      }
    );
  }
}
