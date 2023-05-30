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
  Alert,
} from "@mantine/core"
import { IconClick, IconMoonStars, IconSun } from "@tabler/icons-react"

const classifiers = [
  {
    name: "Cls_1",
    description: "Using Multi layer perceptron to predict the medical specialty of the clinical notes",
    avail: "Will be added soon",
  },
  {
    name: "Cls_2",
    description: "Fine tuned DistilBert model on our dataset to predict the medical specialty of the clinical notes",
    avail: "Available",
  },
  {
    name: "Cls_3",
    description: "Bert feature extraction -> [CLS] hidden state -> 9 hidden linear layers",
    avail: "Will be added soon",
  },
  {
    name: "Cls_4",
    description: "Bert feature extraction -> 512 states concatenated -> 9 hidden linear layers",
    avail: "Will be added soon",
  },
  {
    name: "Cls_5",
    description: "Bert feature extraction -> All hidden states -> GRU net/ BiGRUnet",
    avail: "Will be added soon",
  },
  {
    name: "Cls_6",
    description: "Bert feature extraction -> All hidden states ->  Conv 1D + Capsule Network (decoder used GRU)",
    avail: "Will be added soon",
  },
]

export default function Home() {
  const [color, setColor] = useState("dark")
  const theme = useMantineTheme()
  const classes = useStyles()
  const PRIMARY_COL_HEIGHT = rem(400)
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`
  const CUSTOM_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 10 - ${theme.spacing.md} / 6)`
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [model, setModel] = useState("Cls_2")
  const [rows, setRows] = useState()

  const ths = (
    <tr>
      <th>Medical_specialty</th>
      <th>Score</th>
      {/* <th>Some</th>
      <th>Others</th> */}
    </tr>
  )

  async function Cls_2(data) {
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/oyesaurav/dwellbert", {
        headers: { Authorization: process.env.NEXT_PUBLIC_HUGGING_FACE },
        method: "POST",
        body: JSON.stringify(data),
      })
      const result = await response.json()
      setRows(
        result[0].slice(0, 5).map((element) => (
          <tr key={element.label}>
            <td>{element.label}</td>
            <td>{element.score}</td>
          </tr>
        ))
      )
    }
    catch (error) {
      Alert({ title: "Error", message: "Model hasn't loaded, please try again", color: "red" })
    }
  }

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
                onChange={(event) => setText(event.currentTarget.value)}
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
                  <Button
                    leftIcon={<IconClick size="1rem" />}
                    loading={false}
                    fullWidth
                    onClick={() => Cls_2({ inputs: text })}
                  >
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
                  data={["Cls_1", "Cls_2", "Cls_3", "Cls_4", "Cls_5", "Cls_6"]}
                  classNames={classes}
                />
                <Text fw={500}>{
                  classifiers[model.split("_")[1]-1].description                
                }</Text>
              </Grid.Col>
              <Grid.Col>
                {/* <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} /> */}
                <Table highlightOnHover withBorder fullWidth>
                  <thead>{ths}</thead>
                  <tbody>{
                  classifiers[model.split("_")[1]-1].avail === "Available" ? rows : <tr><td>The model will be added</td></tr>
                  }</tbody>
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
