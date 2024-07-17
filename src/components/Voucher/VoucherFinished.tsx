import PageLayout from "../PageLayout";

interface VoucherFinishedProps {
  pageTitle?: string;
  onBackToHomeClick: () => void;
}

export default function VoucherFinished({
  pageTitle,
  onBackToHomeClick,
}: VoucherFinishedProps) {
  return (
    <PageLayout
      title={pageTitle}
      navbarText={pageTitle}
      hasLocaleChange={false}
      hasShare={false}
      alignContentCenter
      footer={
        <div className="p-4">
          <button
            className="btn btn-block btn-primary"
            onClick={onBackToHomeClick}
          >
            Back to Home
          </button>
        </div>
      }
    >
      <EmptyBox />
      <h5 className="text-heading-small">
        Sorry! All the vouchers are sold out
      </h5>
    </PageLayout>
  );
}

function EmptyBox() {
  return (
    <svg
      width="150"
      height="137"
      viewBox="0 0 150 137"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M0.209961 100.484L62.392 136.388L105.186 111.678L43.006 75.7783L0.209961 100.484Z"
        fill="#003779"
      />
      <path
        d="M103.86 38.7985L95.1577 33.7765L75.2957 22.3086L26.2456 50.6325L46.1377 62.1244L54.8057 67.1304L76.3717 79.5824L125.402 51.2625L125.424 51.2485L103.86 38.7985Z"
        fill="#FFDDA8"
      />
      <path
        d="M75.2982 23.0684L27.5762 50.6303L76.5 80.5L124.098 51.2463L75.2982 23.0684Z"
        fill="#BAD7FF"
      />
      <path
        d="M75.2979 23.0684V72.7762L82.5 77.5L124.1 51.2463L75.2979 23.0684Z"
        fill="#4D95F8"
      />
      <path
        d="M76.1241 79.7116V127.916L54.9803 115.804L54.9802 115.804L46.2644 110.818L46.2642 110.818L26.498 99.4903V51.0625L46.015 62.3378L46.0153 62.338L54.731 67.3558L54.7313 67.356L76.1241 79.7116Z"
        fill="#0057B7"
        stroke="black"
        stroke-width="0.5"
      />
      <path
        d="M76.3784 79.5756V128.343L125.407 100.212V51.2598L76.3784 79.5756Z"
        fill="#4D95F8"
      />
      <path d="M125.407 100.212V51.2598" stroke="black" stroke-width="0.5" />
      <path d="M125.407 100.212L76 128" stroke="black" stroke-width="0.5" />
      <path
        d="M75.0431 22.9051L27.3127 50.4097L8.0788 27.9771L56.5825 0.320549L75.0318 22.321L75.0431 22.9051Z"
        fill="#EFF6FF"
        stroke="black"
        stroke-width="0.5"
      />
      <path
        d="M99.8665 0.764422L148.212 28.7347L124.066 51.0889L75.5078 22.8431L99.3002 1.10545L99.8665 0.764422Z"
        fill="#EFF6FF"
        stroke="black"
        stroke-width="0.5"
      />
      <path
        d="M75.2982 72.4355L68.5 76.5L76.5 80L82.5 76.5L75.2982 72.4355Z"
        fill="#003779"
      />
      <path
        d="M74.2231 78.7346L50.32 71.9344L3.2139 43.9763L27.3345 50.8615L74.2231 78.7346Z"
        fill="#EFF6FF"
        stroke="black"
        stroke-width="0.5"
      />
      <path
        d="M149.113 57.0757L100.935 84.5197L76.6827 79.3889L124.168 51.4961H125.397L149.113 57.0757Z"
        fill="#EFF6FF"
        stroke="black"
        stroke-width="0.5"
      />
    </svg>
  );
}
