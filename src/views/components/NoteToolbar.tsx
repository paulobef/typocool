import React, { Fragment, useState } from "react";
import { IconButton, IconMoreVertical, MenuItem, MenuList } from "sancho";
import Popover from "react-tiny-popover";
import { jsx } from "@emotion/core";

import { EditorControl } from "../pages/Note";

class ErrorBoundary extends React.Component {
  state: any;
  props: any;

  constructor(props: { controlsMap: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher n'importe quelle UI de repli.
      return <Fragment></Fragment>;
    }

    return this.props.children;
  }
}

interface EditorToolbarProps {
  moreControls: Array<EditorControl>;
  controls: JSX.Element;
}
interface PopoverTargetProps extends React.ComponentPropsWithoutRef<"div"> {
  onClick(): void;
}

const PopoverTarget = React.forwardRef<HTMLDivElement, PopoverTargetProps>(
  (props, ref) => (
    <div ref={ref} onClick={props.onClick}>
      {props.children}
    </div>
  )
);

/** @jsx jsx */
export const NoteToolbar = ({ moreControls, controls }: EditorToolbarProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        marginRight: 30,
        marginTop: 50,
      }}
    >
      <ErrorBoundary controlsMap={moreControls}>
        <Fragment>
          <Popover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(!isPopoverOpen)}
            position={"left"}
            containerStyle={{
              border: "1px solid lightgrey",
              borderRadius: "5px",
            }}
            content={
              <MenuList>
                {moreControls.map(
                  ({ icon, label, handler }: EditorControl, key: number) => (
                    <MenuItem
                      key={key}
                      contentBefore={icon}
                      onClick={(event) => handler()}
                    >
                      {label}
                    </MenuItem>
                  )
                )}
              </MenuList>
            }
          >
            {(ref) => (
              <PopoverTarget
                ref={ref}
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              >
                <IconButton
                  variant="ghost"
                  icon={<IconMoreVertical />}
                  label="show more"
                />
              </PopoverTarget>
            )}
          </Popover>
          {controls}
        </Fragment>
      </ErrorBoundary>
    </div>
  );
};
