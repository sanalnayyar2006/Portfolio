"use client"

import { useState } from "react"
import { Terminal, Mail, MapPin, Send, CheckCircle2, Shield } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-24 bg-[#090a0f] border-b border-[#222634] blueprint-grid">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff5219] uppercase tracking-wider mb-2">
            <Terminal size={14} />
            <span>// 04. TRANSMISSION CONSOLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f3f9] uppercase">
            Initiate Contact & Project Inquiry
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Channel Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="panel-matte p-6 border border-[#222634] space-y-6">
              <div className="border-b border-[#1f2432] pb-4">
                <div className="text-xs font-mono text-[#ff5219] mb-1">[DIRECT CHANNELS]</div>
                <h3 className="text-lg font-bold text-[#f1f3f9] uppercase">
                  Engineering Collaboration
                </h3>
                <p className="text-sm text-[#8a94a6] mt-2 leading-relaxed">
                  Available for select high-impact software engineering roles, full-stack application builds, and real-time 3D spatial web consulting.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-[#13161f] border border-[#232838] flex items-center gap-3">
                  <div className="p-2 bg-[#1b202c] text-[#ff5219]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7e899b] uppercase">ELECTRONIC MAIL</div>
                    <div className="text-[#f1f3f9] font-medium">sanal.nayyar@example.com</div>
                  </div>
                </div>

                <div className="p-3 bg-[#13161f] border border-[#232838] flex items-center gap-3">
                  <div className="p-2 bg-[#1b202c] text-[#10b981]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7e899b] uppercase">BASE LOCATION</div>
                    <div className="text-[#f1f3f9] font-medium">San Francisco Bay Area, CA</div>
                  </div>
                </div>

                <div className="p-3 bg-[#13161f] border border-[#232838] flex items-center gap-3">
                  <div className="p-2 bg-[#1b202c] text-[#38bdf8]">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7e899b] uppercase">SECURITY PROTOCOL</div>
                    <div className="text-[#f1f3f9] font-medium">End-to-End Encrypted Communications</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Terminal */}
          <div className="lg:col-span-7">
            <div className="panel-matte p-6 sm:p-8 border border-[#222634]">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-[#1f2432] pb-4 mb-6 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5219]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="text-[#8a94a6] ml-2">TERMINAL_DISPATCH // v1.0</span>
                </div>
                <span className="text-[10px] text-[#7e899b] hidden sm:inline">FORMAT: RAW TEXT</span>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-3 font-mono">
                  <CheckCircle2 size={36} className="text-[#10b981] mx-auto animate-bounce" />
                  <div className="text-sm font-bold text-[#f1f3f9]">TRANSMISSION RECEIVED</div>
                  <p className="text-xs text-[#8a94a6]">
                    Your dispatch payload has been queued. I will reply within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#8a94a6] uppercase tracking-wider">
                        [01] Full Identity / Name *
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Vance"
                        className="w-full px-4 py-2.5 bg-[#12151e] border border-[#232838] focus:border-[#ff5219] focus:outline-none text-xs font-mono text-[#f1f3f9] placeholder-[#555e70]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#8a94a6] uppercase tracking-wider">
                        [02] Reply Email Address *
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. alex@company.com"
                        className="w-full px-4 py-2.5 bg-[#12151e] border border-[#232838] focus:border-[#ff5219] focus:outline-none text-xs font-mono text-[#f1f3f9] placeholder-[#555e70]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#8a94a6] uppercase tracking-wider">
                      [03] Project Specification / Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Outline the project scope, technical requirements, or schedule..."
                      className="w-full px-4 py-2.5 bg-[#12151e] border border-[#232838] focus:border-[#ff5219] focus:outline-none text-xs font-mono text-[#f1f3f9] placeholder-[#555e70] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-tactile btn-tactile-primary w-full py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>TRANSMIT DISPATCH PAYLOAD</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
