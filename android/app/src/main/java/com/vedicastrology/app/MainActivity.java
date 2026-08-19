package com.vedicastrology.app;

import android.content.Intent;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
    @Override
    public void load() {
        super.load();
        // Handle UPI/intent deeplinks so Razorpay payments work inside WebView
        this.bridge.getWebView().setWebViewClient(new BridgeWebViewClient(this.bridge) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("intent://") || url.startsWith("upi://")
                        || url.startsWith("tez://") || url.startsWith("phonepe://")
                        || url.startsWith("paytmmp://") || url.startsWith("bhim://")) {
                    try {
                        Intent intent;
                        if (url.startsWith("intent://")) {
                            intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                        } else {
                            intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        }
                        startActivity(intent);
                    } catch (Exception ignored) {
                    }
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, request);
            }
        });
    }
}
