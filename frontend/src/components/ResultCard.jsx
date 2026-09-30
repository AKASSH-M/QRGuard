import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Link as LinkIcon,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Copy,
  CheckCircle2,
  Globe,
  Bot,
  Cpu,
  Search,
  TriangleAlert,
} from 'lucide-react';

const formatLabelValue = (value, fallback = 'Unknown') => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled';
  if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === 'object') {
    if ('enabled' in value) return value.enabled ? 'Enabled' : 'Disabled';
    if ('present' in value) return value.present ? (value.value || 'Yes') : 'No';
    if ('count' in value && 'matched' in value) return `${value.count} matches`;
    if ('domain_age_days' in value && value.domain_age_days !== null) return `${value.domain_age_days} days`;
    return JSON.stringify(value);
  }
  return String(value);
};

const formatSource = (objectValue, fallback = 'Unknown') => {
  if (!objectValue || typeof objectValue !== 'object') return fallback;
  if (objectValue.source) return objectValue.source;
  if (objectValue.available === false) return 'Unavailable';
  return fallback;
};

const hasMeaningfulValue = (value) => {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized !== 'unknown' && normalized !== 'unavailable' && normalized !== 'n/a';
  }
  return true;
};

const isAvailableSource = (data) => (
  data && data.available !== false && !data.error && !data.connection_error
);

const ResultCard = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const url = result?.url || '';
  const basic = result?.basic || {};
  const features = result?.security_features || {};
  const external = result?.external_intelligence || {};
  const gemini = result?.gemini_analysis || result?.gemini || {};
  const mlPrediction = result?.ml_prediction || {
    label: result?.mlStatus === 'malicious' ? 'Suspicious' : 'Normal',
    confidence: 0,
  };

  const isMalicious = result?.status === 'malicious' || mlPrediction.label === 'Suspicious';
  const displayUrl = url.length > 68 ? `${url.substring(0, 65)}...` : url;
  const safeLink = url.startsWith('http') ? url : `https://${url}`;

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  const featureCards = [
    {
      label: 'Domain Age',
      value: features.domain_age?.domain_age_days !== null && features.domain_age?.domain_age_days !== undefined ? `${features.domain_age.domain_age_days} days` : null,
      source: hasMeaningfulValue(features.domain_age?.source) ? features.domain_age.source : null,
    },
    {
      label: 'Suspicious Keywords',
      value: features.suspicious_keyword_count?.count ? `${features.suspicious_keyword_count.count} matches` : null,
      source: features.suspicious_keyword_count?.matched?.length ? 'Local analysis' : null,
    },
    {
      label: 'URL Entropy',
      value: typeof features.url_entropy === 'number' ? features.url_entropy.toFixed(2) : null,
      source: 'Local analysis',
    },
    {
      label: 'Redirect Count',
      value: features.redirect_count !== null && features.redirect_count !== undefined ? String(features.redirect_count) : null,
      source: features.redirect_count !== null && features.redirect_count !== undefined ? 'Website analysis' : null,
    },
    {
      label: 'IP Address',
      value: features.ip_address_presence?.present ? (features.ip_address_presence.value || 'Present') : null,
      source: features.ip_address_presence?.present ? 'Local detection' : null,
    },
    {
      label: 'Suspicious Patterns',
      value: features.suspicious_url_patterns?.count ? String(features.suspicious_url_patterns.count) : null,
      source: features.suspicious_url_patterns?.count ? 'Local analysis' : null,
    },
    {
      label: 'Domain Reputation',
      value: hasMeaningfulValue(features.domain_reputation?.status) ? String(features.domain_reputation.status) : null,
      source: hasMeaningfulValue(features.domain_reputation?.source) ? features.domain_reputation.source : null,
    },
    {
      label: 'URL Length',
      value: features.url_length ? String(features.url_length) : null,
      source: 'Local analysis',
    },
    {
      label: 'Path Depth',
      value: features.path_depth !== null && features.path_depth !== undefined ? String(features.path_depth) : null,
      source: 'Local analysis',
    },
    {
      label: 'HTTPS',
      value: features.https_verification?.enabled !== undefined ? (features.https_verification.enabled ? 'Enabled' : 'Disabled') : null,
      source: features.https_verification?.protocol || null,
    },
  ].filter((item) => hasMeaningfulValue(item.value));

  const intelligenceSources = [
    { name: 'OpenPhish', data: external.openphish },
    { name: 'PhishTank', data: external.phishtank },
    { name: 'RDAP', data: external.rdap },
    { name: 'Google Web Risk', data: external.google_web_risk },
    { name: 'Website Analysis', data: external.website_analysis },
  ].filter((source) => isAvailableSource(source.data));

  const websiteFields = [
    { label: 'Website Type', value: gemini.website_type },
    { label: 'Domain', value: gemini.domain || basic.domain },
    { label: 'Website Title', value: gemini.website_title },
    { label: 'Organization', value: gemini.organization },
  ].filter((item) => hasMeaningfulValue(item.value));

  const securityAssessment = hasMeaningfulValue(gemini.security_assessment)
    ? gemini.security_assessment
    : null;
  const researchSummary = hasMeaningfulValue(gemini.research_summary)
    && !/analysis failed|client has been closed|cannot send a request/i.test(gemini.research_summary)
    ? gemini.research_summary
    : null;

  const overallMessage = isMalicious
    ? 'Multiple security signals detected'
    : mlPrediction.label === 'Normal' && (!features.suspicious_keyword_count || features.suspicious_keyword_count.count === 0)
      ? 'Insufficient evidence'
      : 'No dominant threat signals detected';

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`glass-panel rounded-2xl overflow-hidden flex flex-col h-full border-t-4 ${
        isMalicious ? 'border-red-500' : 'border-green-500'
      }`}
    >
      <div className={`p-6 pb-8 flex flex-col items-center text-center relative ${isMalicious ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={onReset}
            className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Scan New QR"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl ${isMalicious ? 'bg-red-500/20 text-red-500 shadow-red-500/20' : 'bg-green-500/20 text-green-500 shadow-green-500/20'}`}>
          {isMalicious ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${isMalicious ? 'text-red-400' : 'text-green-400'}`}>
          {isMalicious ? 'Malicious Link' : 'Safe to Visit'}
        </h2>
        <p className="text-slate-300">{overallMessage}</p>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-6">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <LinkIcon size={14} />
              <span>Scanned URL</span>
            </div>
            <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-900/60 px-2 py-1 text-xs text-slate-300">
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-white font-medium break-all pb-2">{displayUrl}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {hasMeaningfulValue(basic.domain) && (
              <div className="rounded-lg bg-slate-900/40 p-2">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Domain</div>
                <div className="text-slate-200 truncate">{basic.domain}</div>
              </div>
            )}
            {hasMeaningfulValue(basic.protocol) && (
              <div className="rounded-lg bg-slate-900/40 p-2">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Protocol</div>
                <div className="text-slate-200">{basic.protocol}</div>
              </div>
            )}
            {hasMeaningfulValue(basic.path_depth) && (
              <div className="rounded-lg bg-slate-900/40 p-2">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Path</div>
                <div className="text-slate-200 truncate">{basic.path_depth}</div>
              </div>
            )}
          </div>
          <a href={safeLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-cyber-blue text-sm hover:text-cyber-neon transition-colors">
            Open original link <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
              <Cpu size={16} className="text-cyber-blue" />
              <span className="font-semibold">ML Prediction</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${isMalicious ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {mlPrediction.label}
              </span>
              <span className="text-slate-300 text-sm">{Math.round((mlPrediction.confidence || 0) * 100)}%</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">Confidence: {Number((mlPrediction.confidence || 0) * 100).toFixed(1)}%</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
              <ShieldCheck size={16} className="text-cyber-neon" />
              <span className="font-semibold">Assessment</span>
            </div>
            <p className="text-sm text-slate-300">{overallMessage}</p>
            <p className="mt-2 text-xs text-slate-400">ML result stays independent from Gemini guidance.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <Globe size={16} className="text-cyber-accent" />
            <span className="font-semibold">Security Features</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureCards.map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/50">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
                <div className="text-lg font-semibold text-slate-100">{item.value}</div>
                {hasMeaningfulValue(item.source) && (
                  <div className="mt-1 text-[11px] text-slate-400">Source: {item.source}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {intelligenceSources.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <Search size={16} className="text-cyber-blue" />
              <span className="font-semibold">External Security Intelligence</span>
            </div>
            <div className="space-y-3">
              {intelligenceSources.map((source) => (
                <div key={source.name} className="rounded-lg bg-slate-900/40 border border-slate-700 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-200">{source.name}</div>
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider ${source.data?.available || source.data?.found || source.data?.in_database || source.data?.threat_detected !== undefined ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                      {source.data?.available || source.data?.found || source.data?.in_database || source.data?.threat_detected !== undefined ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {source.name === 'OpenPhish' && (
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      <div>Match: {source.data?.found ? 'Known match' : 'No known match'}</div>
                      {source.data?.status && <div>Status: {source.data.status}</div>}
                    </div>
                  )}
                  {source.name === 'PhishTank' && (
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      <div>Match: {source.data?.in_database ? 'Known match' : 'No known match'}</div>
                      {source.data?.status && <div>Status: {source.data.status}</div>}
                    </div>
                  )}
                  {source.name === 'RDAP' && (
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      {source.data?.domain_age_days !== null && source.data?.domain_age_days !== undefined && <div>Domain age: {source.data.domain_age_days} days</div>}
                      {source.data?.registration_date && <div>Registration: {source.data.registration_date}</div>}
                    </div>
                  )}
                  {source.name === 'Google Web Risk' && source.data?.threat_detected !== null && source.data?.threat_detected !== undefined && (
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      <div>Threat detected: {source.data.threat_detected ? 'Yes' : 'No'}</div>
                      {source.data?.threat_types?.length > 0 && <div>Threat types: {source.data.threat_types.join(', ')}</div>}
                    </div>
                  )}
                  {source.name === 'Website Analysis' && (
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      {source.data?.title && <div>Title: {source.data.title}</div>}
                      {source.data?.final_url && <div>Final URL: {source.data.final_url}</div>}
                      {source.data?.redirect_count !== null && source.data?.redirect_count !== undefined && <div>Redirects: {source.data.redirect_count}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {websiteFields.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <Bot size={16} className="text-cyber-neon" />
              <span className="font-semibold">Website Intelligence</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {websiteFields.map((field) => (
                <div key={field.label} className="rounded-lg bg-slate-900/40 p-3">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">{field.label}</div>
                  <div className="text-slate-200">{field.value}</div>
                </div>
              ))}
              {hasMeaningfulValue(gemini.content_summary) && gemini.content_summary !== 'No content available.' && (
                <div className="sm:col-span-2 rounded-lg bg-slate-900/40 p-3">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">Content Summary</div>
                  <div className="text-slate-200">{gemini.content_summary}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {(securityAssessment || researchSummary || gemini.phishing_indicators?.length || gemini.suspicious_elements?.length || gemini.legitimacy_indicators?.length || gemini.sources?.length) && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <TriangleAlert size={16} className="text-orange-400" />
              <span className="font-semibold">Gemini AI Research</span>
            </div>
            <div className="space-y-4">
              {securityAssessment && (
                <div className="rounded-lg bg-slate-900/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Security Assessment</div>
                  <div className="text-slate-200">{securityAssessment}</div>
                </div>
              )}
              {researchSummary && (
                <div className="rounded-lg bg-slate-900/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Research Summary</div>
                  <div className="text-slate-200">{researchSummary}</div>
                </div>
              )}
              {(gemini.phishing_indicators?.length || gemini.suspicious_elements?.length || gemini.legitimacy_indicators?.length) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gemini.phishing_indicators?.length > 0 && (
                    <div className="rounded-lg bg-slate-900/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Phishing Indicators</div>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {gemini.phishing_indicators.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {gemini.suspicious_elements?.length > 0 && (
                    <div className="rounded-lg bg-slate-900/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Suspicious Elements</div>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {gemini.suspicious_elements.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {gemini.legitimacy_indicators?.length > 0 && (
                    <div className="sm:col-span-2 rounded-lg bg-slate-900/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Legitimacy Indicators</div>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {gemini.legitimacy_indicators.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {Array.isArray(gemini.sources) && gemini.sources.length > 0 && (
                <div className="rounded-lg bg-slate-900/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Sources</div>
                  <div className="space-y-2">
                    {gemini.sources.map((item, index) => (
                      <a key={`${item.url || item.title || index}`} href={item.url} target="_blank" rel="noreferrer" className="block text-sm text-cyber-blue hover:text-cyber-neon">
                        {item.title || item.url || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isMalicious && (
          <div className="mt-auto p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="text-red-300 font-medium mb-1">Security Recommendation</p>
              <p className="text-slate-400">Do not visit this link. It may lead to phishing, credential theft, or malware downloads.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
