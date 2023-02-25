import Image from 'next/image'
import { CaretLeft } from "phosphor-react";
import { useEffect, useState } from 'react';

import languageIconUrl from "@/images/language-icon.svg";
import twoPeopleIllustrationUrl from "@/images/two-people-illustration.svg"
import heroBlobImageUrl from "@/images/hero-blob.png"
import calculatorPercentIconUrl from "@/images/calculator-percent-icon.svg";
import contentThumbNailImageUrl from "@/images/how-to-manage-money.png";

const FULL_OPACITY_AT = 72;
const MULTIPLYING_FACTOR = 1 / FULL_OPACITY_AT;

export default function LandingPage() {

    const [navbarOpacity, setNavbarOpacity] = useState<number>(0);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const opacity = window.scrollY * MULTIPLYING_FACTOR;
            if (opacity > 1) {
                setNavbarOpacity(1)
            } else {
                setNavbarOpacity(opacity)
            }
        })
    }, []);

  return (
    <div className='container-wrapper'>
        <nav className="navbar text-heading text-medium" style={{
            background: `rgb(255, 255, 255, ${navbarOpacity})`,
            ...(navbarOpacity >= 1 ? {boxShadow: "0 0 10px #f5f5f5"} : {})
        }}>
            <div className="navbar-content">
                <div style={{
                    display: "flex",
                }}>
                    <button className='btn-only-icon mr-2'><CaretLeft size={24} /></button>
                    <span>Financial Literacy</span>
                </div>
                <button className='btn-only-icon'>
                    <Image src={languageIconUrl} alt="Language Change" width={24} height={24} />
                </button>
            </div>
        </nav>
        <div className="hero" style={{
            backgroundImage: `url(${heroBlobImageUrl.src}), radial-gradient(51.9% 48.2% at 7.22% 14.84%, #FFFFFF 0%, #EBF5FF 100%)`,
            backgroundPositionX: "right",
            backgroundRepeat: "no-repeat"
        }}>
            <figure className='mb-3'>
                <Image src={twoPeopleIllustrationUrl} alt="Hey Abhijeeth" />
            </figure>
            <h2 className='text-sub-title text-medium mb-2'>Hey Abhijeeth,</h2>
            <p className='clr-text-secondary'>Understanding finances has never been easier. Start reading!</p>
        </div>
        <div className="container" style={{
                marginTop: "-6.4rem"
            }}>
            <div style={{
                background: "#fff",
                border: "2px solid #E5EEF8",
                borderRadius: "1.6rem",
                width: "100%",
                minHeight: "24rem",
                padding: "1.6rem"
            }}>
                <figure>
                    <Image src={contentThumbNailImageUrl} alt="content" style={{ width: "100%" }} />
                </figure>
                <h3 className='text-body text-medium my-2'>How to Manage Your Money?</h3>
                <p className='text-caption clr-text-secondary'>Most people talk about earning more money, however, not many people talk... <span className='clr-brand-default text-semibold'>Read More</span></p>
            </div>
        </div>
        <div className="container">
            <h3 className='clr-text-secondary mb-3'>Fin Literacy Tools</h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                columnGap: "1.6rem",
                rowGap: "1.6rem",
            }}>
                <div style={{
                    background: "#FCF2E3",
                    borderRadius: "0.8rem",
                    padding: "0.8rem",
                }}>
                    <figure>
                        <Image src={calculatorPercentIconUrl} alt="icon" />
                    </figure>
                    <p className='text-caption mt-4'><b>Loan EMI</b><br/> Calculator</p>
                </div>
                <div style={{
                    background: "#FCF2E3",
                    borderRadius: "0.8rem",
                    padding: "0.8rem",
                }}>
                    <figure>
                        <Image src={calculatorPercentIconUrl} alt="icon" />
                    </figure>
                    <p className='text-caption mt-4'><b>Loan EMI</b><br/> Calculator</p>
                </div>
                <div style={{
                    background: "#FCF2E3",
                    borderRadius: "0.8rem",
                    padding: "0.8rem",
                }}>
                    <figure>
                        <Image src={calculatorPercentIconUrl} alt="icon" />
                    </figure>
                    <p className='text-caption mt-4'><b>Loan EMI</b><br/> Calculator</p>
                </div>
            </div>
        </div>
    </div>
  )
}
