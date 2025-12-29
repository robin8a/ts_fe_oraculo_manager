# Authentication Setup

AWS Cognito authentication has been added to the application. Users must sign in before accessing the app and uploading files to S3.

## What Was Added

1. **Login Page** (`src/pages/Login/Login.tsx`)
   - Sign in form
   - Sign up form
   - Email verification
   - Beautiful, modern UI

2. **Auth Hook** (`src/hooks/useAuth.ts`)
   - Manages authentication state
   - Provides sign in, sign up, sign out functions
   - Checks authentication status

3. **Protected Routes**
   - All routes are now protected
   - Users are redirected to login if not authenticated
   - Login page is accessible at `/login`

4. **User Info in Sidebar**
   - Shows current user's username
   - Sign out button

5. **Storage Service Update**
   - Now uses `protected` level for S3 uploads (requires authentication)
   - More secure file storage

## How It Works

1. **First Time Users:**
   - Click "Sign up" on the login page
   - Enter username, email, and password (min 8 characters)
   - Check email for verification code
   - Enter verification code to activate account
   - Sign in with username and password

2. **Returning Users:**
   - Enter username and password
   - Click "Sign In"

3. **After Sign In:**
   - User can access all pages
   - S3 uploads will work (authenticated uploads)
   - User info shown in sidebar
   - Can sign out anytime

## Configuration

The authentication uses your existing Cognito configuration:
- **User Pool ID**: `us-east-1_chqNtZEAP`
- **Identity Pool ID**: `us-east-1:07a6df03-fc6e-4f45-b979-b84f17b27fc6`
- **Region**: `us-east-1`

## Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
   - You should see the login page

3. Create a new account:
   - Click "Sign up"
   - Fill in the form
   - Check your email for verification code
   - Enter the code

4. Sign in and test:
   - Sign in with your credentials
   - Navigate to "KoboToolbox Import"
   - Try importing data - S3 uploads should now work!

## Troubleshooting

### "User does not exist" error
- Make sure you've signed up first
- Check that email verification was completed

### "Incorrect username or password"
- Verify your credentials
- Try resetting password (if password reset is configured)

### S3 upload still fails with 403
- Make sure you're signed in (check sidebar for username)
- Verify S3 bucket policy allows authenticated uploads
- Check that Cognito Identity Pool has proper IAM permissions

### Can't see login page
- Clear browser cache
- Check browser console for errors
- Verify Amplify is configured correctly

## Next Steps

If you want to add password reset functionality:

1. Configure password reset in Cognito Console
2. Add password reset UI to Login page
3. Use `resetPassword` and `confirmResetPassword` from `aws-amplify/auth`

## Security Notes

- Passwords must be at least 8 characters
- Email verification is required
- Files are stored with `protected` level (user-specific)
- Sessions are managed by Cognito

