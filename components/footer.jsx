import { Github, Linkedin, Mail, Box, ShieldCheck } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#08090d] border-t border-[#222634] py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#1c202c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff5219] text-white flex items-center justify-center font-bold">
              <Box size={18} />
            </div>
            <div>
              <div className="text-base font-bold text-[#f1f3f9] font-mono tracking-wider">
                SANAL NAYYAR
              </div>
              <p className="text-xs text-[#7e899b] font-mono mt-0.5">
                FULL-STACK & 3D INTERACTIVE SYSTEMS STUDIO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#12151d] border border-[#222634] text-[#8a94a6] hover:text-[#f1f3f9] hover:border-[#384156] transition-colors"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#12151d] border border-[#222634] text-[#8a94a6] hover:text-[#f1f3f9] hover:border-[#384156] transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:sanal.nayyar@example.com"
              className="p-2 bg-[#12151d] border border-[#222634] text-[#8a94a6] hover:text-[#f1f3f9] hover:border-[#384156] transition-colors"
              title="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#7e899b]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#10b981]" />
            <span>RENDER ENGINE: THREE.JS WEBGL / ZERO GLASSMORPHISM</span>
          </div>

          <div>
            © {new Date().getFullYear()} SANAL NAYYAR. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  )
}
