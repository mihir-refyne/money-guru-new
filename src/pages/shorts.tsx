
import Image from "next/image";
import { CaretLeft } from "phosphor-react";
import contentThumbNailImageUrl from "../images/how-to-manage-money.png";
import languageIconUrl from "../images/language-icon.svg";

export default function ShortsPage() {
  return (
    <div className="container-wrapper">
        <nav className="navbar text-heading text-medium" style={{
            background: "#fff",
            boxShadow: "0 0 10px #f5f5f5"
        }}>
            <div className="navbar-content">
                <div style={{
                    display: "flex",
                }}>
                    <button className='btn-only-icon mr-2'><CaretLeft size={24} /></button>
                </div>
                <button className='btn-only-icon'>
                    <Image src={languageIconUrl} alt="Language Change" width={24} height={24} />
                </button>
            </div>
        </nav>
        <div className="pt-12">
            <div className="container">
                <figure>
                    <Image src={contentThumbNailImageUrl} alt="title here" style={{
                    width: "100%"
                }} />
                </figure>
                <h3 className="text-heading text-medium my-3">How to Manage Your Money?</h3>
                <p className="clr-text-secondary">Handling your finances the right way should be a priority, and it should drive your daily spending and saving decisions. Personal Finance experts advise taking the time to learn the basics, from how to manage a checking or debit account to how to pay your bills on time and build from there. Managing your money demands constant attention to your spending and to your accounts and not living beyond your financial means.</p>
            </div>
            <div className="footer">
                <div className="container">
                    <button className="btn btn-primary btn-block">Book A Session</button>
                </div>
            </div>
        </div>
    </div>
  )
}
