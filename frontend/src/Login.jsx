import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const username = useRef("");
  const password = useRef("");

  const isInit = useRef(false);
  const navigate = useNavigate();

  const {
    login,
    isLoggedIn,
    isLogInError,
    loginErrorMsg,
  } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isInit.current) {
      isInit.current = true;
      return;
    }

    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const onLogin = async () => {
    const usernameValue = username.current.value;
    const passwordValue = password.current.value;

    if (!usernameValue || !passwordValue) {
      return;
    }

    setIsLoading(true);

    console.log("username:", usernameValue);

    await login(usernameValue, passwordValue);

    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: 2,
      }}
    >
      <Card
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 430,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #2563eb, #4f46e5)",
            color: "white",
            textAlign: "center",
            padding: "35px 25px 30px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              marginBottom: 1,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
            }}
          >
            Sign in to continue to your account
          </Typography>
        </Box>

        <CardContent
          sx={{
            padding: 4,
          }}
        >
          <Box sx={{ marginBottom: 2.5 }}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              placeholder="Enter your username"
              inputRef={username}
              autoComplete="username"
            />
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              inputRef={password}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onLogin();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {isLogInError && (
            <Box
              sx={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: 2,
                padding: 1.5,
                marginBottom: 2,
              }}
            >
              <Typography
                color="error"
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                {loginErrorMsg}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onLogin}
            disabled={isLoading}
            sx={{
              height: 52,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #2563eb, #4f46e5)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8, #4338ca)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                sx={{ color: "white" }}
              />
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              marginTop: 3,
              color: "text.secondary",
            }}
          >
            Authentication secured with JWT
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}