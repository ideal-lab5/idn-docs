import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Decentralized",
    Svg: require("@site/static/img/blockchain.svg").default,
    description: (
      <>
        The Ideal Network is a blockchain that uses a novel consensus mechanism.
        It produces publicly verifiable secret keys in each block header.
      </>
    ),
  },
  {
    title: "Onchain Randomness",
    Svg: require("@site/static/img/dice.svg").default,
    description: (
      <>
        Onchain randomness is refreshed with each new block and can be used in
        smart contracts and runtime modules for random number generation.
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
  {
    title: "Programmable Privacy",
    Svg: require("@site/static/img/privacy.svg").default,
    description: (
      <>
        Encrypt once, decrypt many. The Ideal network enables programmable,
        zero-knowledge data encryption mechanisms using practical witness
        encryption.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--6")}>
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
