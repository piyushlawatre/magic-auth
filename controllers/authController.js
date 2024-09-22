export const signUp = async (req, res, next) => {
  try {
    res.json({
      statusCode: 200,
      message: "signup ",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    res.json({
      statusCode: 200,
      message: "login ",
    });
  } catch (error) {
    next(error);
  }
};
