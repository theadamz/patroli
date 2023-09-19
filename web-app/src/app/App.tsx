import MainRoute from "@routes/MainRoute";
import { MantineProvider } from "@mantine/core";
import "@fontsource/inter";
import themes from "@components/Themes";

export default function App() {
  return (
    <MantineProvider theme={themes} withGlobalStyles withNormalizeCSS>
      <MainRoute />
    </MantineProvider>
  );
}
