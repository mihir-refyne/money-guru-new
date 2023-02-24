import SwipeButton from "@/components/SwipeButton"
import SwipeableButton from "@/components/SwipeButton2"
import Image from "next/image"
import introIllustrationUrl from '../images/intro-illustration.svg'

export default function IntroPage() {
  return (
    <div className="container-wrapper">
        <div className="container text-center">
            <h1 className="text-sub-title text-semibold" style={{
                lineHeight: "42px"
            }}>Increase your financial knowledge with Refyne!</h1>
            <figure className="my-6">
                <Image src={introIllustrationUrl} alt="Intro illustration" />
            </figure>
        </div>
        <div className="footer">
            <div className="p-4" style={{
                borderBottom: "1px dashed #C9CDD1",
            }}>
                <p className="clr-text-secondary">12,000+ people have benefitted from Financial Advice from Refyne</p>
            </div>
            <div className="px-4 pt-4">
                {/* <button className="btn btn-primary btn-block">Next</button> */}
                {/* <SwipeButton /> */}
                <SwipeableButton color="#0057B7" text="Slide to Unlock" text_unlocked="Unlocked" onSuccess={() => {
                    console.log("success")
                }} />
            </div>
        </div>
    </div>
  )
}
