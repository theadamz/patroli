import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Group,
  rem,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  inner: {
    position: "relative",
  },

  image: {
    ...theme.fn.cover(),
    opacity: 0.75,
  },

  content: {
    paddingTop: rem(220),
    position: "relative",
    zIndex: 1,

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(540),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export default function PageNotFound() {
  const { classes } = useStyles();

  const navigate = useNavigate();

  // set title page
  useDocumentTitle("Halaman tidak ditemukan");

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>Halaman tidak ditemukan</Title>
          <Text
            color="dimmed"
            size="lg"
            align="center"
            className={classes.description}
          >
            Halaman yang Anda coba buka tidak ditemukan. Anda mungkin salah
            mengetik alamat, atau halaman telah dipindahkan ke URL lain. Jika
            menurut Anda ini adalah kesalahan, hubungi tim support.
          </Text>
          <Group position="center">
            <Button size="md" onClick={goBack}>
              Kembali
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
