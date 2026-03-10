import { Page, PageHeader } from "@/components/layout/Page";
import { PackageCarousel } from "@/components/PackageCarousel";

const Package = () => {
    return (
        <Page>
            <PageHeader
                title="Studio Package"
                description="Manage all the available studio package" 
            />

            <div className="grid gap-6 py-8 lg:grid-cols-[1fr_800px]">
                <PackageCarousel />
            </div>
        </Page>
    );
}

export default Package;