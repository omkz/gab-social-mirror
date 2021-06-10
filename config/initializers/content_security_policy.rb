# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

base_host     = Rails.configuration.x.web_domain
assets_host   = Rails.configuration.action_controller.asset_host
assets_host ||= "http#{Rails.configuration.x.use_https ? 's' : ''}://#{base_host}"

Rails.application.config.content_security_policy do |p|
  p.base_uri        :none
  p.default_src     :none
  p.frame_ancestors :self, "https://*.gab.com", "https://*.openplatform.us"
  p.font_src        :self, assets_host
  p.img_src         :self, :https, :data, :blob, assets_host
  p.style_src       :self, :unsafe_inline, assets_host
  p.media_src       :self, :https, :data, assets_host
  p.frame_src       :self, :https
  p.manifest_src    :self, assets_host

  if Rails.env.development?
    p.script_src :self, :https, :unsafe_eval
    p.default_src :self, :https, :unsafe_eval
    p.connect_src :self, :https, 'http://localhost:3035', 'ws://localhost:3035'
  else
    p.script_src :self, :https
    p.default_src :self, :https
  end
end

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
# Rails.application.config.content_security_policy_report_only = true
