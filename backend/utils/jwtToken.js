export const sendToken = (user, message, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + (Number(process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000),
    ),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      user,
      token,
    });
};

