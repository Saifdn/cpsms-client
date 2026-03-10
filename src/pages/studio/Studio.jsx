import { Page, PageHeader } from "@/components/layout/Page";
import StudioCard from "@/components/StudioCard";

import {studio} from "@/data/Studio";

const Studio = () => {
  return (
    <Page>
      <PageHeader title="Studio" description="List of available studio." />
      <div
        className="
            grid 
            gap-6 
            py-8 
            grid-cols-1               // mobile: 1 column
            sm:grid-cols-2            // small tablets: 2
            md:grid-cols-auto-fit     // wait — better version below
            lg:grid-cols-3 xl:grid-cols-4   // or use auto-fit
            "
      >
        {studio.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}           // ← pass data to card
            />
          ))}
      </div>
    </Page>
  );
};

export default Studio;
