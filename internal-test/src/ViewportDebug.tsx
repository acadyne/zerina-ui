// internal-test/src/ViewportDebug.tsx

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  ScrollArea,
  Stack,
  useUIViewport,
} from "zerina-ui";


function BoolBadge({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <Badge
      colorScheme={
        value
          ? "success"
          : "neutral"
      }
      variant="subtle"
    >
      {label}:{" "}
      {String(value)}
    </Badge>
  );
}


function ValueRow({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean;
}) {
  return (
    <Box
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        gap:
          "1rem",

        fontSize:
          "var(--ui-font-size-sm)",
      }}
    >
      <Box
        style={{
          color:
            "var(--ui-text-muted)",
        }}
      >
        {label}
      </Box>

      <Box
        style={{
          fontWeight:
            "var(--ui-font-weight-medium)",
        }}
      >
        {String(value)}
      </Box>
    </Box>
  );
}


export function ViewportDebug() {
  const viewport =
    useUIViewport();


  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">

          <Heading size="sm">
            Viewport Intelligence
          </Heading>


          <Box
            style={{
              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight:
                1.5,
            }}
          >
            Valida resolución responsive,
            orientación, capacidades de input,
            density y modos forzados del viewport.
          </Box>


          <Box
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",

              gap:
                "0.5rem 1rem",
            }}
          >
            <ValueRow
              label="mode"
              value={
                viewport.mode
              }
            />

            <ValueRow
              label="kind"
              value={
                viewport.kind
              }
            />

            <ValueRow
              label="width"
              value={
                viewport.width
              }
            />

            <ValueRow
              label="height"
              value={
                viewport.height
              }
            />

            <ValueRow
              label="aspectRatio"
              value={
                viewport.aspectRatio.toFixed(3)
              }
            />

            <ValueRow
              label="orientation"
              value={
                viewport.orientation
              }
            />

            <ValueRow
              label="inputKind"
              value={
                viewport.inputKind
              }
            />

            <ValueRow
              label="densityMode"
              value={
                viewport.densityMode
              }
            />

            <ValueRow
              label="density"
              value={
                viewport.density
              }
            />

            <ValueRow
              label="tablet breakpoint"
              value={
                viewport.breakpoints.tablet
              }
            />

            <ValueRow
              label="desktop breakpoint"
              value={
                viewport.breakpoints.desktop
              }
            />
          </Box>


          <Box
            style={{
              display:
                "flex",

              flexWrap:
                "wrap",

              gap:
                "0.5rem",
            }}
          >
            <BoolBadge
              label="mobile"
              value={
                viewport.isMobile
              }
            />

            <BoolBadge
              label="tablet"
              value={
                viewport.isTablet
              }
            />

            <BoolBadge
              label="desktop"
              value={
                viewport.isDesktop
              }
            />

            <BoolBadge
              label="portrait"
              value={
                viewport.isPortrait
              }
            />

            <BoolBadge
              label="landscape"
              value={
                viewport.isLandscape
              }
            />

            <BoolBadge
              label="narrow"
              value={
                viewport.isNarrow
              }
            />

            <BoolBadge
              label="wide"
              value={
                viewport.isWide
              }
            />

            <BoolBadge
              label="short"
              value={
                viewport.isShort
              }
            />

            <BoolBadge
              label="tall"
              value={
                viewport.isTall
              }
            />

            <BoolBadge
              label="touch"
              value={
                viewport.isTouch
              }
            />

            <BoolBadge
              label="hover"
              value={
                viewport.hasHover
              }
            />
          </Box>


          <Box
            style={{
              display:
                "flex",

              flexWrap:
                "wrap",

              gap:
                "0.5rem",

              padding:
                "0.75rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-md)",

              background:
                "var(--ui-surface)",
            }}
          >
            <Button
              size="sm"
              variant="outline"
              onPress={
                viewport.setAutoMode
              }
            >
              Auto
            </Button>


            <Button
              size="sm"
              variant="outline"
              onPress={
                viewport.setMobileMode
              }
            >
              Mobile
            </Button>


            <Button
              size="sm"
              variant="outline"
              onPress={
                viewport.setTabletMode
              }
            >
              Tablet
            </Button>


            <Button
              size="sm"
              variant="outline"
              onPress={
                viewport.setDesktopMode
              }
            >
              Desktop
            </Button>
          </Box>


          <ScrollArea
            scrollbar="thin"

            style={{
              margin:
                0,

              padding:
                "0.75rem",

              maxHeight:
                "260px",

              borderRadius:
                "var(--ui-radius-md)",

              border:
                "1px solid var(--ui-border)",

              background:
                "var(--ui-surface-container)",

              color:
                "var(--ui-text)",

              fontSize:
                "0.8rem",

              lineHeight:
                1.5,

              whiteSpace:
                "pre",

              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            {
              JSON.stringify(
                viewport,
                null,
                2
              )
            }
          </ScrollArea>

        </Stack>
      </CardBody>
    </Card>
  );
}


ViewportDebug.displayName =
  "ViewportDebug";