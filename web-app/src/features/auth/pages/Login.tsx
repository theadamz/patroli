import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  rem,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import LoginHook from "@features/auth/hooks/LoginHook";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(900),
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1652410057440-b0243ac8bb86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(900),
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export default function Login() {
  useDocumentTitle(`${import.meta.env.VITE_APP_NAME} - Masuk`);

  const { signIn } = LoginHook();
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          {import.meta.env.VITE_APP_NAME}
        </Title>
        <form>
          <TextInput label="Email" placeholder="Email Anda" size="sm" />
          <PasswordInput
            label="Password"
            placeholder="Password Anda"
            mt="md"
            size="sm"
          />
          <Button type="submit" fullWidth mt="xl" size="md">
            Masuk
          </Button>

          <Button type="button" fullWidth mt="xl" size="md" onClick={signIn}>
            Test
          </Button>
        </form>

        <Text ta="center" mt="md">
          Belum memiliki akun?{" "}
          <Anchor<"a"> href="/register" weight={700}>
            Registrasi
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
