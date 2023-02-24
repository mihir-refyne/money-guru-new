import Image from 'next/image'
import fincoachFillerIllustrationUrl from '../images/fincoach-filler-illustration.svg'

export default function FinCoachFillerPage() {
    return (
        <div className="container-wrapper">
            <div className="container">
                <h1 className="text-title">1,000+ Users Have Benefitted From 1:1 Sessions</h1>
                <figure className='my-6'>
                    <Image src={fincoachFillerIllustrationUrl} alt="Fin coach Filler Illustration" />
                </figure>
                <div className="alert alert-grey">
                    Our financial experts will help you manage expenses, increase savings & plan investments.
                </div>
            </div>
            <div className="footer">
                <div className="container">
                    <button className="btn btn-primary btn-block">Book A Session</button>
                </div>
            </div>
        </div>
      )
}
