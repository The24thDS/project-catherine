import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiPopover, EuiButtonIcon, EuiPopoverTitle } from "@elastic/eui";

import styles from "./DropDownMenu.module.sass";

class DropDownMenu extends Component {
  static propTypes = {
    MenuItemComponent: PropTypes.func.isRequired,
    menuItemsData: PropTypes.array.isRequired,
    menuButtonIcon: PropTypes.string.isRequired,
    menuTitle: PropTypes.string.isRequired,
  };

  state = {
    isPopoverOpen: false,
  };

  toggleIsPopoverOpen = () => {
    this.setState((prevState) => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }));
  };

  render() {
    const { isPopoverOpen } = this.state;
    const {
      MenuItemComponent,
      menuItemsData,
      menuButtonIcon,
      menuTitle,
    } = this.props;

    const MenuButton = (
      <EuiButtonIcon
        className={styles.icon}
        iconType={menuButtonIcon}
        iconSize="l"
        onClick={this.toggleIsPopoverOpen}
        style={{ backgroundColor: isPopoverOpen ? "#028D68" : "#227455" }}
        aria-label="Next"
      />
    );

    const items = menuItemsData.map((itemData, i) => (
      <MenuItemComponent
        {...itemData}
        onClick={() => {
          this.toggleIsPopoverOpen();
          itemData.onClick();
        }}
        key={`${menuTitle} ${i}`}
      />
    ));

    return (
      <div>
        <EuiPopover
          className={styles.button}
          button={MenuButton}
          isOpen={isPopoverOpen}
          closePopover={this.toggleIsPopoverOpen}
        >
          <EuiPopoverTitle>{menuTitle}</EuiPopoverTitle>
          {items.length ? (
            items
          ) : (
            <span style={{ opacity: 0.5 }}>
              We've looked everywhere but couldn't find any
            </span>
          )}
        </EuiPopover>
      </div>
    );
  }
}
export default DropDownMenu;
