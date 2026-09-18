// internal-test/src/AdaptiveScaffoldDebug.tsx

import React from "react";
import {
  AdaptiveScaffold,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  ScreenContent,
  Stack,
  type AdaptiveScaffoldMode,
  useToast,
} from "zerina-ui";
import { NavigationNode } from "zerina-ui/patterns/navigation";

type DemoId =
  | "home"
  | "tasks"
  | "activity"
  | "profile"
  | "settings"
  | "appearance";

const labels: Record<DemoId, string> = {
  home: "Inicio",
  tasks: "Tareas",
  activity: "Actividad",
  profile: "Perfil",
  settings: "Ajustes",
  appearance: "Apariencia",
};

function DemoPanel({ activeId }: { activeId: string }) {
  return (
    <ScreenContent padded scrollable scrollbar="thin">
      <Stack spacing="0.75rem">
        <Box
          style={{
            padding: "1rem",
            borderRadius: "var(--ui-radius-xl)",
            border: "1px solid var(--ui-border)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--ui-primary) 10%, var(--ui-surface)), var(--ui-surface))",
          }}
        >
          <Stack spacing="0.45rem">
            <Heading size="sm">{labels[activeId as DemoId] ?? activeId}</Heading>

            <Box
              style={{
                color: "var(--ui-text-muted)",
                fontSize: "var(--ui-font-size-sm)",
                lineHeight: 1.5,
              }}
            >
              Esta pantalla vive dentro de AdaptiveScaffold. Cambia la navegación
              según el modo: bottom en mobile, rail en tablet y sidebar en
              desktop.
            </Box>
          </Stack>
        </Box>

        {Array.from({ length: activeId === "activity" ? 16 : 8 }, (_, index) => (
          <Box
            key={index}
            style={{
              padding: "0.85rem",
              borderRadius: "var(--ui-radius-lg)",
              border: "1px solid var(--ui-border)",
              background: "var(--ui-surface)",
              boxShadow: "var(--ui-shadow-sm)",
            }}
          >
            <Box style={{ fontWeight: "var(--ui-font-weight-bold)" }}>
              {labels[activeId as DemoId] ?? activeId} #{index + 1}
            </Box>

            <Box
              style={{
                marginTop: "0.2rem",
                color: "var(--ui-text-muted)",
                fontSize: "var(--ui-font-size-sm)",
                lineHeight: 1.45,
              }}
            >
              Contenido de prueba para validar scroll, navegación adaptativa y
              viewport contenido.
            </Box>
          </Box>
        ))}
      </Stack>
    </ScreenContent>
  );
}

const items: NavigationNode[] = [
  {
    id: "home",
    label: "Inicio",
    icon: "⌂",
  },
  {
    id: "tasks",
    label: "Tareas",
    icon: "▣",
    badge: (
      <Badge variant="solid" colorScheme="danger">
        5
      </Badge>
    ),
  },
  {
    id: "activity",
    label: "Actividad",
    icon: "≡",
  },
  {
    id: "profile",
    label: "Perfil",
    icon: "◉",
  },
  {
    id: "system",
    label: "Sistema",
    icon: "⚙",
    selectable: false,
    children: [
      {
        id: "settings",
        label: "Ajustes",
        icon: "⚙",
      },
      {
        id: "appearance",
        label: "Apariencia",
        icon: "◐",
      },
    ],
  },
];

export function AdaptiveScaffoldDebug() {
  const { toast } = useToast();

  const [activeId, setActiveId] = React.useState("home");
  const [mode, setMode] = React.useState<AdaptiveScaffoldMode>("auto");

  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">
          <Heading size="sm">AdaptiveScaffold</Heading>

          <Box
            style={{
              color: "var(--ui-text-muted)",
              fontSize: "var(--ui-font-size-sm)",
              lineHeight: 1.5,
            }}
          >
            Scaffold adaptativo construido con piezas Zerina: Scaffold,
            BottomNavigation, NavigationRail, NavigationList, TopAppBar y
            ScreenContent. Esta demo también valida styles y slotProps del
            patrón.
          </Box>

          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {(["auto", "mobile", "tablet", "desktop"] as AdaptiveScaffoldMode[]).map(
              (item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={mode === item ? "solid" : "outline"}
                  onPress={() => setMode(item)}
                >
                  {item}
                </Button>
              )
            )}
          </Box>

          <Box
            style={{
              height: 720,
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-xl)",
              overflow: "hidden",
              background: "var(--ui-bg)",
              boxShadow: "var(--ui-shadow-lg)",
              position: "relative",
            }}
          >
            <AdaptiveScaffold
              viewport="contained"
              mode={mode}
              items={items}
              activeId={activeId}
              onActiveIdChange={(next) => {
                setActiveId(next);

                toast({
                  title: "AdaptiveScaffold",
                  description: `Activo: ${next}`,
                  variant: "success",
                });
              }}
              title={({ activeItem, mode: resolvedMode }) =>
                `${activeItem?.label ?? "Adaptive"} · ${resolvedMode}`
              }
              subtitle="Mobile bottom · Tablet rail · Desktop sidebar"
              leading={
                <IconButton
                  ariaLabel="Menú"
                  size="sm"
                  variant="ghost"
                  icon="≡"
                  onPress={() =>
                    toast({
                      title: "Leading",
                      description: "Acción del TopAppBar adaptativo.",
                      variant: "info",
                    })
                  }
                />
              }
              actions={
                <IconButton
                  ariaLabel="Nueva acción"
                  size="sm"
                  variant="ghost"
                  icon="+"
                  onPress={() =>
                    toast({
                      title: "Action",
                      description: `Acción en ${activeId}.`,
                      variant: "success",
                    })
                  }
                />
              }
              styles={{
                root: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 12%, transparent)",
                  outlineOffset: "-1px",
                },
                appBar: {
                  boxShadow:
                    "0 1px 0 color-mix(in srgb, var(--ui-primary) 12%, transparent)",
                },
                body: {
                  background:
                    "color-mix(in srgb, var(--ui-primary) 3%, var(--ui-bg))",
                },
                rail: {
                  background:
                    "color-mix(in srgb, var(--ui-primary) 4%, transparent)",
                },
                sidebar: {
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--ui-primary) 7%, var(--ui-surface)), var(--ui-surface))",
                },
                content: {
                  background:
                    "color-mix(in srgb, var(--ui-surface) 96%, transparent)",
                },
                mobileContent: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 10%, transparent)",
                  outlineOffset: "-1px",
                },
                tabletContent: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 12%, transparent)",
                  outlineOffset: "-1px",
                },
                desktopContent: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                  outlineOffset: "-1px",
                },
              }}
              slotProps={{
                root: {
                  "data-demo-slot-root": "adaptive-scaffold",
                },
                appBar: {
                  "data-demo-slot-app-bar": "adaptive-scaffold-app-bar",
                },
                body: {
                  "data-demo-slot-body": "adaptive-scaffold-body",
                },
                rail: {
                  "data-demo-slot-rail": "adaptive-scaffold-rail",
                },
                sidebar: {
                  "data-demo-slot-sidebar": "adaptive-scaffold-sidebar",
                },
                content: {
                  "data-demo-slot-content": "adaptive-scaffold-content",
                },
                mobileContent: {
                  "data-demo-slot-mobile-content":
                    "adaptive-scaffold-mobile-content",
                },
                tabletContent: {
                  "data-demo-slot-tablet-content":
                    "adaptive-scaffold-tablet-content",
                },
                desktopContent: {
                  "data-demo-slot-desktop-content":
                    "adaptive-scaffold-desktop-content",
                },
              }}
              bottomNavigationProps={{
                variant: "floating",
                indicator: "pill",
                labelBehavior: "active",
                density: "comfortable",
                badgeAnchor: "icon",
                badgePlacement: "top-end",
                // activeIconScale: 1.08,
                itemMinWidth: 58,
                styles: {
                  activeItem: {
                    background:
                      "color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 18%, transparent)",
                  },
                },
              }}
              navigationRailProps={{
                variant: "surface",
                indicator: "pill",
                labelBehavior: "active",
                density: "comfortable",
                styles: {
                  activeItem: {
                    background:
                      "color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 18%, transparent)",
                  },
                },
              }}
              navigationListProps={{
                collapsedBehavior: "flyout",
                activeBehavior: "contains",
                defaultOpenIds: ["system"],
              }}
            >
              {({ activeId: currentActiveId }) => (
                <DemoPanel activeId={currentActiveId} />
              )}
            </AdaptiveScaffold>
          </Box>

          <Box
            style={{
              padding: "0.75rem",
              borderRadius: "var(--ui-radius-md)",
              border: "1px solid var(--ui-border)",
              background: "var(--ui-surface)",
              color: "var(--ui-text-muted)",
              fontSize: "var(--ui-font-size-sm)",
              lineHeight: 1.5,
            }}
          >
            Checklist: auto debe responder al ancho del contenedor; mobile usa
            BottomNavigation, tablet usa NavigationRail, desktop usa
            NavigationList. Sistema debe abrir hijos en desktop. En DevTools
            deben aparecer los data-demo-slot-* del AdaptiveScaffold.
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}