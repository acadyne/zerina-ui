// @vitest-environment node

import type {
  NavigationLinkMeta,
  NavigationNode,
  RoutedAdaptiveScaffoldProps,
} from "zerina-ui";

import {
  RoutedAdaptiveScaffold,
} from "zerina-ui";

import {
  describe,
  expect,
  it,
} from "vitest";


type ConsumerMeta =
  NavigationLinkMeta & {
    analyticsId:
      string;

    source:
      "consumer";
  };


const items:
  NavigationNode<ConsumerMeta>[] = [
    {
      id:
        "dashboard",

      label:
        "Dashboard",

      meta: {
        href:
          "/dashboard",

        analyticsId:
          "dashboard-nav",

        source:
          "consumer",
      },
    },
  ];


function InferenceFixture() {
  return (
    <RoutedAdaptiveScaffold
      items={items}
      navigate={(
        href,
        item,
      ) => {
        const source:
          "consumer" | undefined =
          item.meta?.source;

        const analyticsId:
          string | undefined =
          item.meta?.analyticsId;

        void href;
        void source;
        void analyticsId;
      }}
      onItemChange={(
        item,
      ) => {
        const analyticsId:
          string | undefined =
          item.meta?.analyticsId;

        void analyticsId;
      }}
    >
      {(context) => {
        const source:
          "consumer" | undefined =
          context
            .activeItem
            ?.meta
            ?.source;

        return source ?? null;
      }}
    </RoutedAdaptiveScaffold>
  );
}


describe(
  "Phase 5 RoutedAdaptiveScaffold public generic contract",
  () => {
    it(
      "preserves custom link metadata through props and generic JSX inference",
      () => {
        const props:
          RoutedAdaptiveScaffoldProps<ConsumerMeta> = {
            items,

            navigate:
              (
                _href,
                item,
              ) => {
                const analyticsId:
                  string | undefined =
                  item.meta?.analyticsId;

                void analyticsId;
              },

            onItemChange:
              (item) => {
                const source:
                  "consumer" | undefined =
                  item.meta?.source;

                void source;
              },

            children:
              (context) =>
                context
                  .activeItem
                  ?.meta
                  ?.analyticsId ??
                null,
          };

        const fixture =
          <InferenceFixture />;

        expect(
          props.items[0]
            ?.meta
            ?.analyticsId,
        ).toBe(
          "dashboard-nav",
        );

        expect(
          fixture.type,
        ).toBe(
          InferenceFixture,
        );
      },
    );
  },
);
