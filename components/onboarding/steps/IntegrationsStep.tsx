import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Settings,
  Building,
  Mail,
  MessageSquare,
  Phone,
  Key,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface IntegrationsStepProps {
  onboarding: {
    progress: {
      tenantId: string | null;
      integrationsConfigured: string[];
    };
    isLoading: boolean;
    error: string | null;
    completeStep: (step: 'integrations') => void;
    skipStep: (step: 'integrations') => void;
    goBack: () => void;
    updateTenantSettings: (settings: Record<string, unknown>) => Promise<boolean>;
    addConfiguredIntegration: (id: string) => void;
    clearError: () => void;
  };
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  type: 'manual' | 'api_key' | 'api_credentials';
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
  }>;
  instructions?: string[];
  docsUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'bankgiro',
    name: 'Bankgiro',
    description: 'Automatisk betalningsövervakning',
    icon: <Building className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-emerald-600/10',
    type: 'manual',
    instructions: [
      'Kontakta din bank för att aktivera Bankgiro',
      'Ange Zyloras bankgironummer som mottagare för betalningsrapporter',
      'Bankgironummer: 123-4567 (exempel)',
      'Det kan ta 1-2 bankdagar innan betalningar börjar registreras',
    ],
  },
  {
    id: 'resend',
    name: 'E-post (Resend)',
    description: 'Skicka påminnelser via e-post',
    icon: <Mail className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/10',
    type: 'api_key',
    fields: [
      {
        name: 'resend_api_key',
        label: 'Resend API-nyckel',
        type: 'password',
        placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
    ],
    docsUrl: 'https://resend.com/docs/api-reference/introduction',
  },
  {
    id: 'twilio',
    name: 'SMS (Twilio)',
    description: 'Skicka SMS-påminnelser',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-red-600/10',
    type: 'api_credentials',
    fields: [
      {
        name: 'twilio_account_sid',
        label: 'Account SID',
        type: 'text',
        placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      {
        name: 'twilio_auth_token',
        label: 'Auth Token',
        type: 'password',
        placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
    ],
    docsUrl: 'https://www.twilio.com/docs/sms/quickstart',
  },
  {
    id: 'blandai',
    name: 'AI-telefoni (Bland.ai)',
    description: 'Automatiska påminnelsesamtal',
    icon: <Phone className="w-6 h-6" />,
    color: 'text-violet-400',
    bgColor: 'from-violet-500/20 to-violet-600/10',
    type: 'api_key',
    fields: [
      {
        name: 'blandai_api_key',
        label: 'Bland.ai API-nyckel',
        type: 'password',
        placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
      },
    ],
    docsUrl: 'https://docs.bland.ai/',
  },
];

const IntegrationsStep: React.FC<IntegrationsStepProps> = ({ onboarding }) => {
  const {
    progress,
    isLoading,
    error,
    completeStep,
    skipStep,
    goBack,
    updateTenantSettings,
    addConfiguredIntegration,
    clearError,
  } = onboarding;

  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savingIntegration, setSavingIntegration] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedIntegration((prev) => (prev === id ? null : id));
    setLocalError(null);
    clearError();
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSaveIntegration = async (integration: Integration) => {
    setSavingIntegration(integration.id);
    setLocalError(null);

    // Validate fields
    if (integration.fields) {
      for (const field of integration.fields) {
        if (!formData[field.name]?.trim()) {
          setLocalError(`${field.label} krävs`);
          setSavingIntegration(null);
          return;
        }
      }
    }

    // Build settings object
    const settings: Record<string, unknown> = {};
    if (integration.fields) {
      for (const field of integration.fields) {
        settings[field.name] = formData[field.name];
      }
    }

    const success = await updateTenantSettings(settings);

    if (success) {
      addConfiguredIntegration(integration.id);
      setExpandedIntegration(null);
      // Clear form data for this integration
      if (integration.fields) {
        const newFormData = { ...formData };
        for (const field of integration.fields) {
          delete newFormData[field.name];
        }
        setFormData(newFormData);
      }
    }

    setSavingIntegration(null);
  };

  const handleMarkAsConfigured = (integrationId: string) => {
    addConfiguredIntegration(integrationId);
    setExpandedIntegration(null);
  };

  const handleContinue = () => {
    completeStep('integrations');
  };

  const handleSkip = () => {
    skipStep('integrations');
  };

  const displayError = localError || error;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">
          Konfigurera integrationer
        </h2>
        <p className="text-gray-400 mt-2">
          Anslut dina tjänster för att maximera automatiseringen. Du kan konfigurera dessa senare.
        </p>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{displayError}</p>
        </div>
      )}

      {/* Integrations list */}
      <div className="space-y-4 mb-8">
        {INTEGRATIONS.map((integration) => {
          const isConfigured = progress.integrationsConfigured.includes(integration.id);
          const isExpanded = expandedIntegration === integration.id;
          const isSaving = savingIntegration === integration.id;

          return (
            <div
              key={integration.id}
              className={`glass border rounded-xl overflow-hidden transition-all ${
                isConfigured ? 'border-green-500/30' : 'border-white/10'
              }`}
            >
              {/* Integration header */}
              <button
                onClick={() => handleToggleExpand(integration.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={integration.color}>{integration.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{integration.name}</h3>
                    {isConfigured && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{integration.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {isConfigured ? (
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                      Konfigurerad
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                      Ej konfigurerad
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="pt-4 space-y-4">
                    {/* Manual setup instructions */}
                    {integration.type === 'manual' && integration.instructions && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white">Instruktioner</h4>
                        <ol className="space-y-2">
                          {integration.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-3 text-sm">
                              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="text-gray-300">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                        <button
                          onClick={() => handleMarkAsConfigured(integration.id)}
                          className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-all w-full"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Markera som konfigurerad</span>
                        </button>
                      </div>
                    )}

                    {/* API key / credentials form */}
                    {(integration.type === 'api_key' || integration.type === 'api_credentials') &&
                      integration.fields && (
                        <div className="space-y-4">
                          {integration.fields.map((field) => (
                            <div key={field.name}>
                              <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                {field.label}
                              </label>
                              <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                  type={field.type}
                                  id={field.name}
                                  value={formData[field.name] || ''}
                                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm font-mono"
                                />
                              </div>
                            </div>
                          ))}

                          {integration.docsUrl && (
                            <a
                              href={integration.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Läs dokumentationen</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleSaveIntegration(integration)}
                            disabled={isSaving || isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Sparar...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Spara konfiguration</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="glass border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Konfigurerade integrationer</span>
          <span className="text-white font-medium">
            {progress.integrationsConfigured.length} av {INTEGRATIONS.length}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={goBack}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka</span>
        </button>

        <button
          onClick={handleSkip}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <span>Hoppa över</span>
        </button>

        <button
          onClick={handleContinue}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition-all"
        >
          <span>Fortsätt</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default IntegrationsStep;
