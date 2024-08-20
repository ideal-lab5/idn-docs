import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Decentralized",
    Svg: require("@site/static/img/blockchain.svg").default,
    description: (
      <>
        The Ideal Network is permisionless blockchain that acts as an entropy layer for the next generation of fair protocols, enabling new paradigms for trustless interactions. 
      </>
    ),
  },
  {
    title: "On-chain Randomness",
    Svg: require("@site/static/img/dice.svg").default,
    description: (
      <>
        The IDN enables interoperable randomness beacons, producing publicly verifiable on-chain randomenss that can be use in trustless, on-chain protocols. 
      </>
    ),
  },
  {
    title: "Timelock Encryption",
    Svg: require("@site/static/img/timer.svg").default,
    description: (
      <>
        The Ideal Network enables timelock encryption, allowing you to
        effortlessly send messages into the future and unlock them right from
        your browser!
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
