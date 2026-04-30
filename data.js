const briefingData = {
  executive_summary: [
    "Multiple software supply-chain incidents hit npm and PyPI, with trojanized developer packages targeting credentials, tokens, and cloud access that MSPs should treat as an immediate package-hygiene and secret-rotation issue.",
    "SAP-related npm package compromise is the top story because poisoned packages can enter developer and automation workflows silently, making dependency pinning, registry monitoring, and CI/CD secret isolation urgent.",
    "CISA added actively exploited ConnectWise and Windows flaws to the KEV catalog, signaling near-term patching and exposure review priorities for MSP-managed remote administration and Windows estates.",
    "Attackers are increasingly using GitHub lookalike repos, fake admin tools, and tunneling-backed malware delivery to evade trust checks and exfiltrate browser, system, and cloud credentials.",
    "North Korea-linked tradecraft continues evolving with AI-assisted malicious npm implants, fake hiring fronts, and RAT deployment, reinforcing the need for stronger developer verification and workstation containment."
  ],
  cyber_news: [
    {
      title: "SAP-Related npm Packages Compromised in Credential-Stealing Supply Chain Attack",
      category: "Threat",
      blurb: "Researchers reported malicious tampering of SAP-related npm packages designed to steal credentials and other sensitive developer environment data. The risk is highest where these packages were automatically pulled into build, integration, or admin workflows.",
      expand_content: "For MSPs, the priority actions are identifying every environment that installed affected package versions, revoking exposed secrets, and reviewing CI/CD logs for suspicious outbound traffic. Development hosts, build runners, and integration servers should be treated as potentially exposed if they handled SAP-related dependencies from npm during the affected window.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    },
    {
      title: "PyTorch Lightning Compromised in PyPI Supply Chain Attack to Steal Credentials",
      category: "Threat",
      blurb: "A PyPI package associated with the PyTorch Lightning ecosystem was reportedly compromised to harvest credentials from developer systems. The incident underscores ongoing targeting of ML and Python package trust paths.",
      expand_content: "MSPs supporting data science or automation teams should audit Python package provenance, check virtual environments and build pipelines for the affected versions, and rotate any credentials stored on impacted hosts. EDR telemetry from developer workstations should be reviewed for unusual process execution, package install activity, and outbound connections following package updates.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    },
    {
      title: "EtherRAT Distribution Spoofing Administrative Tools via GitHub Facades",
      category: "Campaign",
      blurb: "Attackers are distributing EtherRAT through fake GitHub projects masquerading as legitimate administrative or utility tooling. The lure relies on trust in open-source hosting and familiar IT tool branding.",
      expand_content: "Technical teams should validate repository history, maintainer reputation, release signatures, and code provenance before using GitHub-hosted utilities in production. Application control, browser isolation for research, and sandbox detonation of downloaded admin tools can reduce exposure to this style of malware delivery.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    },
    {
      title: "New Python Backdoor Uses Tunneling Service to Steal Browser and Cloud Credentials",
      category: "Campaign",
      blurb: "A newly reported Python backdoor uses a tunneling service for command-and-control and data theft, including browser and cloud credentials. Tunneling can blend malicious traffic with legitimate remote access and testing activity.",
      expand_content: "MSPs should review use of reverse tunnels and similar remote-access utilities across managed endpoints, especially where they are not centrally approved. Detection opportunities include new Python persistence, browser profile access, credential file reads, and unusual traffic to tunneling infrastructure from user endpoints or jump boxes.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    },
    {
      title: "CISA Adds Actively Exploited ConnectWise and Windows Flaws to KEV",
      category: "Hardening",
      blurb: "CISA added new ConnectWise and Microsoft Windows vulnerabilities to its Known Exploited Vulnerabilities catalog, confirming active exploitation in the wild. This elevates patching urgency for MSPs and downstream customers using affected products.",
      expand_content: "Because ConnectWise platforms and Windows systems are common in SMB and nonprofit environments, MSPs should map exposure immediately, prioritize internet-facing instances, and verify mitigation status with customer-facing reporting. KEV inclusion should also trigger log review for exploitation attempts and any signs of follow-on credential abuse or lateral movement.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    },
    {
      title: "New Wave of DPRK Attacks Uses AI-Inserted npm Malware, Fake Firms, and RATs",
      category: "Campaign",
      blurb: "Researchers describe a North Korea-linked campaign combining fake companies, recruiter-style pretexts, and malicious npm packages containing AI-assisted code changes. The objective appears to be initial access, espionage, and credential theft.",
      expand_content: "This is especially relevant to MSPs serving software teams or handling contractor onboarding, where trust in coding tests, interview packages, or recruiter-shared repositories may be exploited. Strengthen identity verification for hiring workflows, isolate code evaluation environments, and block unmanaged package installation on business endpoints where possible.",
      link: "https://thehackernews.com/",
      source: "The Hacker News"
    }
  ],
  deep_dive: {
    title: "SAP-Related npm Packages Compromised in Credential-Stealing Supply Chain Attack",
    content: "The SAP-related npm package compromise stands out because it targets a high-trust layer in enterprise development and integration workflows: third-party dependencies used by admins, developers, and automation tied to business-critical SAP environments. Researchers found malicious package behavior consistent with credential theft, creating risk not just to developer endpoints but also to CI/CD runners, integration services, and any hosts where SAP tooling was installed or updated during the affected period. For MSPs, the main operational concern is blast radius: poisoned packages can expose npm tokens, environment variables, local config secrets, browser session data, and potentially credentials used to access SAP-connected systems or cloud services. Immediate actions should include identifying affected package versions, tracing where they were installed, rotating all secrets present on those systems, and checking logs for suspicious outbound connections or post-install scripts. This incident reinforces core supply-chain controls: dependency pinning, private registries, build isolation, software provenance checks, and preventing developer workstations from holding production credentials.",
    source: "The Hacker News"
  },
  biggest_hacks: [
    {
      title: "SAP-Related npm Packages Compromised in Credential-Stealing Supply Chain Attack",
      link: "https://thehackernews.com/",
      source: "The Hacker News",
      severity: "Critical",
      brief: "Compromised SAP-related npm packages introduced credential theft risk into trusted development and integration workflows."
    },
    {
      title: "PyTorch Lightning Compromised in PyPI Supply Chain Attack to Steal Credentials",
      link: "https://thehackernews.com/",
      source: "The Hacker News",
      severity: "High",
      brief: "A Python package supply-chain incident targeted developer credentials in environments using PyTorch Lightning-related components."
    },
    {
      title: "New Wave of DPRK Attacks Uses AI-Inserted npm Malware, Fake Firms, and RATs",
      link: "https://thehackernews.com/",
      source: "The Hacker News",
      severity: "High",
      brief: "North Korea-linked operators used fake companies and malicious npm packages to gain access and deploy remote access tooling."
    },
    {
      title: "EtherRAT Distribution Spoofing Administrative Tools via GitHub Facades",
      link: "https://thehackernews.com/",
      source: "The Hacker News",
      severity: "High",
      brief: "Attackers used counterfeit GitHub repos and fake admin tools to trick IT users into deploying a RAT."
    }
  ],
  vulnerabilities: [
    {
      cve_id: "CVE-2025-3935",
      product: "ConnectWise ScreenConnect",
      severity: "High",
      active_exploitation_status: "Added to CISA KEV; actively exploited in the wild."
    },
    {
      cve_id: "CVE-2025-29824",
      product: "Microsoft Windows Common Log File System (CLFS)",
      severity: "Critical",
      active_exploitation_status: "Added to CISA KEV; active exploitation reported."
    },
    {
      cve_id: "CVE-2024-1709",
      product: "ConnectWise ScreenConnect",
      severity: "Critical",
      active_exploitation_status: "Previously listed in CISA KEV; actively exploited and still highly relevant to exposed MSP environments."
    },
    {
      cve_id: "CVE-2024-21410",
      product: "Microsoft Exchange Server",
      severity: "High",
      active_exploitation_status: "Known exploited vulnerability with continued relevance in SMB and nonprofit environments running on-prem Exchange."
    },
    {
      cve_id: "CVE-2023-23397",
      product: "Microsoft Outlook",
      severity: "Critical",
      active_exploitation_status: "Actively exploited and relevant where legacy Outlook clients remain in use."
    }
  ],
  recent_headlines: [
    {
      title: "SAP-Related npm Packages Compromised in Credential-Stealing Supply Chain Attack",
      link: "https://thehackernews.com/"
    },
    {
      title: "CISA Adds Actively Exploited ConnectWise and Windows Flaws to KEV",
      link: "https://thehackernews.com/"
    },
    {
      title: "PyTorch Lightning Compromised in PyPI Supply Chain Attack to Steal Credentials",
      link: "https://thehackernews.com/"
    },
    {
      title: "New Wave of DPRK Attacks Uses AI-Inserted npm Malware, Fake Firms, and RATs",
      link: "https://thehackernews.com/"
    },
    {
      title: "EtherRAT Distribution Spoofing Administrative Tools via GitHub Facades",
      link: "https://thehackernews.com/"
    },
    {
      title: "New Python Backdoor Uses Tunneling Service to Steal Browser and Cloud Credentials",
      link: "https://thehackernews.com/"
    }
  ],
  source_counts: [
    {
      source: "The Hacker News",
      count: 6
    }
  ]
};