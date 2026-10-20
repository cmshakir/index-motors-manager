package online.indexmotors.manager;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WhatsAppLauncher")
public class WhatsAppLauncherPlugin extends Plugin {

    private void launchIntent(Intent intent) {
        Activity activity = getActivity();
        if (activity != null) {
            activity.startActivity(intent);
        } else {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
        }
    }

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        String phone = call.getString("phone", "");
        String text = call.getString("text", "");
        if (phone == null) phone = "";
        if (text == null) text = "";

        String cleanPhone = phone.replaceAll("[^0-9]", "");

        try {
            // Method 1: Direct WhatsApp Scheme Intent
            String schemeUrl;
            if (!cleanPhone.isEmpty()) {
                schemeUrl = "whatsapp://send?phone=" + Uri.encode(cleanPhone) + "&text=" + Uri.encode(text);
            } else {
                schemeUrl = "whatsapp://send?text=" + Uri.encode(text);
            }

            Intent schemeIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(schemeUrl));
            try {
                launchIntent(schemeIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_scheme");
                call.resolve(ret);
                return;
            } catch (ActivityNotFoundException e1) {
                // scheme failed, continue
            }

            // Method 2: Direct package Intent (WhatsApp or WhatsApp Business)
            Intent packageIntent = new Intent(Intent.ACTION_SEND);
            packageIntent.setType("text/plain");
            packageIntent.putExtra(Intent.EXTRA_TEXT, text);
            if (!cleanPhone.isEmpty()) {
                packageIntent.putExtra("jid", cleanPhone + "@s.whatsapp.net");
            }

            try {
                packageIntent.setPackage("com.whatsapp");
                launchIntent(packageIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_package");
                call.resolve(ret);
                return;
            } catch (Exception e2) {
                // WhatsApp standard not installed
            }

            try {
                packageIntent.setPackage("com.whatsapp.w4b");
                launchIntent(packageIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_business");
                call.resolve(ret);
                return;
            } catch (Exception e3) {
                // WhatsApp Business not installed
            }

            // Method 3: Browser Intent to api.whatsapp.com
            String webUrl;
            if (!cleanPhone.isEmpty()) {
                webUrl = "https://api.whatsapp.com/send?phone=" + Uri.encode(cleanPhone) + "&text=" + Uri.encode(text);
            } else {
                webUrl = "https://api.whatsapp.com/send?text=" + Uri.encode(text);
            }

            Intent webIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(webUrl));
            try {
                launchIntent(webIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "web_browser");
                call.resolve(ret);
                return;
            } catch (ActivityNotFoundException e4) {
                // Browser not available
            }

            // Method 4: Universal text chooser
            Intent chooser = Intent.createChooser(
                new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text),
                "Share via WhatsApp"
            );
            launchIntent(chooser);
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("method", "share_chooser");
            call.resolve(ret);

        } catch (Exception ex) {
            call.reject("Could not open WhatsApp: " + ex.getMessage());
        }
    }
}
