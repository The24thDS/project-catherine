import React from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTitle,
  EuiIcon
} from "@elastic/eui";

import "./landingPage.sass";
import blackLogo from "../../assets/logo-black.svg";

export default function LandingPage() {
  document.title = "Project Catherine | Landing";
  return (
    <EuiFlexGroup
      className="landing"
      alignItems="center"
      gutterSize="none"
      responsive={true}
      wrap={true}
    >
      <EuiFlexItem className="landing--information" component="section">
        <EuiText>
          <EuiTitle textTransform="uppercase">
            <h1>Project Catherine</h1>
          </EuiTitle>
          <EuiIcon className="logo" size="original" type={blackLogo} />
          <article>
            <p>
              But I must explain to you how all this mistaken idea of denouncing
              pleasure and praising pain was born and I will give you a complete
              account of the system, and expound the actual teachings of the
              great explorer of the truth, the master-builder of human
              happiness. No one rejects, dislikes, or avoids pleasure itself,
              because it is pleasure, but because those who do not know how to
              pursue pleasure rationally encounter consequences that are
              extremely painful. Nor again is there anyone who loves or pursues
              or desires to obtain pain of itself, because it is pain, but
              because occasionally circumstances occur in which toil and pain
              can procure him some great pleasure. To take a trivial example,
              which of us ever undertakes laborious physical exercise, except to
              obtain some advantage from it? But who has any right to find fault
              with a man who chooses to enjoy a pleasure that has no annoying
              consequences, or one who avoids a pain that
            </p>
          </article>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem className="landing--forms" component="section">
        login/signup
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
