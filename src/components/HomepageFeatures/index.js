import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Verifiable Randomness as a Service",
    Svg: require("@site/static/img/dice.svg").default,
    description: (
      <>
        The Ideal Network brings tamper-proof, publicly auditable, context-free and verifiable randomness directly on-chain.
      </>
    ),
  },
  {
    title: "Built for Interoperability",
    Svg: require("@site/static/img/blockchain.svg").default,
    description: (
      <>
        Parachains and other chains can integrate IDN randomness with minimal changes via XCM or SDKs. Fair coordination across networks is now possible.
      </>
    ),
  },
  {
    title: "Timelock Encryption and Covert coordination",
    Svg: require("@site/static/img/timer.svg").default,
    description: (
      <>
        The IDN enables a timelocked transaction pool, providing cryptographic frontrunning and MEV protection while making new kinds of trustless multiparty protocols practical.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">A New Kind of Fairness Layer for Web3</Heading>
          <p className="hero__subtitle">
            Ideal Network is a decentralized entropy "daemon" for building fair, encrypted, time-aware protocols, powered by verifiable randomness and timelock encryption.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
