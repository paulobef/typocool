import React, { Fragment } from 'react'
import { IconButton, IconMoreVertical, MenuItem, MenuList, ResponsivePopover } from 'sancho'
import { jsx } from '@emotion/core'

import { EditorControl } from '../pages/Note'

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
  controlsMap: Array<EditorControl>;
}

/** @jsx jsx */
export const NoteToolbar = ({ controlsMap }: EditorToolbarProps) => {
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
      <ErrorBoundary controlsMap={controlsMap}>
        <Fragment>
          <ResponsivePopover
            content={
              <MenuList>
                {controlsMap.map(
                  ({ icon, label, handler }: EditorControl, key: number) => (
                    <MenuItem key={key} contentBefore={icon} onClick={handler}>
                      {label}
                    </MenuItem>
                  )
                )}
              </MenuList>
            }
            placement={"auto"}
          >
            <IconButton
              variant="ghost"
              icon={<IconMoreVertical />}
              label="show more"
            />
          </ResponsivePopover>
        </Fragment>
      </ErrorBoundary>
    </div>
  );
};
