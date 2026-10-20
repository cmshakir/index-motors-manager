package online.indexmotors.manager;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WhatsAppLauncher")
public class WhatsAppLauncherPlugin extends Plugin {

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        String phone = call.getString("phone", "");
        String text = call.getString("text", "");
        if (phone == null) phone = "";
        if (text == null) text = "";

        // Remove non-digits from phone number
        String cleanPhone = phone.replaceAll("[^0-9]", "");

        try {
            // Method 1: Direct WhatsApp Scheme Intent (whatsapp://send?...)
            String schemeUrl;
            if (!cleanPhone.isEmpty()) {
                schemeUrl = "whatsapp://send?phone=" + Uri.encode(cleanPhone) + "&text=" + Uri.encode(text);
            } else {
                schemeUrl = "whatsapp://send?text=" + Uri.encode(text);
            }

            Intent schemeIntent = new Intent(Intent.ACTION_VIEW);
            schemeIntent.setData(Uri.parse(schemeUrl));
            schemeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            try {
                getContext().startActivity(schemeIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_scheme");
                call.resolve(ret);
                return;
            } catch (ActivityNotFoundException e1) {
                // Scheme not directly caught, proceed to next methods
            }

            // Method 2: Direct Package Intent (com.whatsapp or com.whatsapp.w4b)
            Intent packageIntent = new Intent(Intent.ACTION_SEND);
            packageIntent.setType("text/plain");
            packageIntent.putExtra(Intent.EXTRA_TEXT, text);
            if (!cleanPhone.isEmpty()) {
                packageIntent.putExtra("jid", cleanPhone + "@s.whatsapp.net");
            }
            packageIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            // Try standard WhatsApp
            try {
                packageIntent.setPackage("com.whatsapp");
                getContext().startActivity(packageIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_package");
                call.resolve(ret);
                return;
            } catch (Exception e2) {
                // Try WhatsApp Business
            }

            try {
                packageIntent.setPackage("com.whatsapp.w4b");
                getContext().startActivity(packageIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "whatsapp_business");
                call.resolve(ret);
                return;
            } catch (Exception e3) {
                // Neither package responded, proceed to web URL
            }

            // Method 3: Browser Intent to api.whatsapp.com
            String webUrl;
            if (!cleanPhone.isEmpty()) {
                webUrl = "https://api.whatsapp.com/send?phone=" + Uri.encode(cleanPhone) + "&text=" + Uri.encode(text);
            } else {
                webUrl = "https://api.whatsapp.com/send?text=" + Uri.encode(text);
            }

            Intent webIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(webUrl));
            webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            try {
                getContext().startActivity(webIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("method", "web_browser");
                call.resolve(ret);
                return;
            } catch (ActivityNotFoundException e4) {
                // Browser not available, proceed to universal chooser
            }

            // Method 4: Universal Android Share Chooser
            Intent chooser = Intent.createChooser(
                new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text),
                "Share via WhatsApp"
            );
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("method", "share_chooser");
            call.resolve(ret);

        } catch (Exception ex) {
            call.reject("Could not open WhatsApp: " + ex.getMessage());
        }
    }
}
