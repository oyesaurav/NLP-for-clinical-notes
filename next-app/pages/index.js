import Head from "next/head"
import { useState } from "react"
import {
  MantineProvider,
  Container,
  Grid,
  SimpleGrid,
  Skeleton,
  useMantineTheme,
  rem,
  Textarea,
  Stack,
  Button,
  Group,
  FileButton,
  SegmentedControl,
  Text,
  createStyles,
  Table,
  ColorSchemeProvider,
  Header,
  ActionIcon,
} from "@mantine/core"
import { IconClick, IconMoonStars, IconSun } from "@tabler/icons-react"

const elements = [
  { label: "Label1", score: 0.8942, some: "C", others: "Carbon" },
  { label: "Label2", score: 0.8942, some: "C", others: "Carbon" },
  { label: "Label3", score: 0.8942, some: "C", others: "Carbon" },
  { label: "Label4", score: 0.8942, some: "C", others: "Carbon" },
  { label: "Label5", score: 0.8942, some: "C", others: "Carbon" },
]

export default function Home() {
  const [color, setColor] = useState("light")
  const theme = useMantineTheme()
  const classes = useStyles()
  const PRIMARY_COL_HEIGHT = rem(400)
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`
  const CUSTOM_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 10 - ${theme.spacing.md} / 6)`
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [model, setModel] = useState("Ens")

  const ths = (
    <tr>
      <th>Label</th>
      <th>Score</th>
      <th>Some</th>
      <th>Others</th>
    </tr>
  )

  const rows = elements.map((element) => (
    <tr key={element.label}>
      <td>{element.label}</td>
      <td>{element.score}</td>
      <td>{element.some}</td>
      <td>{element.others}</td>
    </tr>
  ))

  return (
    <div>
      <Head>
        <title>Clinical notes</title>
        <meta name="description" content="NLP for clinical notes - DSAI project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: color }}>
        <Header height={56} mb={120}>
          <Container className={classes.inner}>
            {/* <MantineLogo size={28} /> */}
            <Group>
              <h2>Clinical notes</h2>
              <ActionIcon
                onClick={() => setColor(color === "dark" ? "light" : "dark")}
                size="lg"
                sx={(theme) => ({
                  backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                  color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
                  marginLeft: "auto",
                })}
              >
                {color === "dark" ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
              </ActionIcon>
            </Group>
          </Container>
        </Header>
        <Container my="md">
          <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}
            <Stack>
              <Textarea
                placeholder="Type or paste the clinical notes here"
                label="Clinical notes"
                radius="md"
                height={PRIMARY_COL_HEIGHT}
                autosize
                minRows={15}
                maxRows={18}
              />
              <Grid>
                <Grid.Col span={8}>
                  <Group position="center">
                    <FileButton onChange={setFile} accept="text/pdf,text.txt">
                      {(props) => (
                        <Button {...props} fullWidth variant="outline">
                          Upload clinical notes pdf
                        </Button>
                      )}
                    </FileButton>
                  </Group>

                  {file && (
                    <Text size="sm" align="center" mt="sm">
                      Picked file: {file.name}
                    </Text>
                  )}
                </Grid.Col>
                <Grid.Col span={4}>
                  <Button leftIcon={<IconClick size="1rem" />} loading={false} fullWidth>
                    Submit
                  </Button>
                </Grid.Col>
              </Grid>
            </Stack>
            <Grid gutter="md">
              <Grid.Col>
                <SegmentedControl
                  style={{
                    marginTop: theme.spacing.md,
                  }}
                  fullWidth
                  radius="xl"
                  size="md"
                  value={model}
                  onChange={setModel}
                  data={["Ens", "Bert_1", "Distilbert_1", "MLP", "xyz"]}
                  classNames={classes}
                />
              </Grid.Col>
              <Grid.Col>
                {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} /> */}
                <Table highlightOnHover withBorder fullWidth>
                  <thead>{ths}</thead>
                  <tbody>{rows}</tbody>
                </Table>
              </Grid.Col>
            </Grid>
          </SimpleGrid>
        </Container>
      </MantineProvider>
    </div>
  )
}

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: rem(56),

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },
  root: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]}`,
  },

  indicator: {
    backgroundImage: theme.fn.gradient({ from: "pink", to: "orange" }),
  },

  control: {
    border: "0 !important",
  },

  label: {
    "&, &:hover": {
      "&[data-active]": {
        color: theme.white,
      },
    },
  },
}))
