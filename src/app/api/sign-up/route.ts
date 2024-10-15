import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    // wrong way -: When you use "form-data" the information is sent as multipart/form-data and not as application/json. The error you get is because you are trying to parse JSON data in your route. But the data it received isn't in JSON format.

    const { username, email, password } = await request.json();

    // console.log("Parsed request data", { username, email, password });

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // console.log(
    //   "existingUserVerifiedByUsername",
    //   existingUserVerifiedByUsername
    // );

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserEmail = await UserModel.findOne({
      email,
    });

    if (existingUserEmail) {
      if (existingUserEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "email already exist",
          }),
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password as string, 10);
        existingUserEmail.password = hashedPassword;
        existingUserEmail.verifyCode = verifyCode;
        existingUserEmail.verigyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password as string, 10);
      const expiryDate = new Date(Date.now() + 3600000);
      // expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verigyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email as string,
      username as string,
      verifyCode as string
    );

    if (!emailResponse.success)
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    return Response.json(
      {
        success: true,
        message: emailResponse.message,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("error while registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
