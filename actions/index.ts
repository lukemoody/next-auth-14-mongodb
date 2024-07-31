"use server";
/**
 * This action is used to submit new User data to the DB
 * Using very basic validation at the moment, would need
 * to be more robust for a production environment
 *
 * This action is then called in CreateUser and used with
 * `useFormState`
 *
 * https://react-hook-form.com/docs/useformstate
 */
import User from "@/models/User";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

type userAction = {
  message: string;
};

export async function createUserAction(
  formState: userAction,
  formData: FormData
) {
  try {
    // Get values from formData
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // If no values exist, dislay below message
    if (!name || !username || !email || !password) {
      return {
        message: "All fields are required",
      };
    }

    // Wait for user call to DB and check everything is uniqe with the current username being created so we don't get duplicates
    const duplicateUsername = await User.findOne({
      username: username,
    });

    // Show error message if username already exists
    if (duplicateUsername) {
      return {
        message: "Username already exists",
      };
    }

    // Check for duplicated emails
    const duplicateEmail = await User.findOne({
      email: email,
    });

    // Show error message if email already exists
    if (duplicateEmail) {
      return {
        message: "Email already exists",
      };
    }

    // Example validation for password length
    if (password.length < 5) {
      return {
        message: "Password is too short",
      };
    }

    // Hash the users password before storing in DB to make more secure
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct user object to save
    const userObj = {
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    };

    // Create new user entry in database
    await User.create(userObj);

    console.log("SUCCESS");
  } catch (error: unknown) {
    return {
      message: "Unknown error occured!",
    };
  }

  // Send user back to homepage on successful entry
  // Could do something different here if we wanted like send them
  // to a dashboard or payment page etc
  redirect("/");
}
