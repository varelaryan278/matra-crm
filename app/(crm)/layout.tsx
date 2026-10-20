import { CrmProvider } from "@/lib/crm-store"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { LeadSheet } from "@/components/leads/lead-sheet"

const CrmLayout = ({ children }: { children: React.ReactNode }) => (
  <CrmProvider>
    <div className="flex h-full overflow-hidden">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
    <LeadSheet />
  </CrmProvider>
)

export default CrmLayout
