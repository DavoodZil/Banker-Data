import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, KeyRound, Loader2, Copy } from "lucide-react";
import { useAccessTokens } from "@/hooks/api";
import { useToast } from "@/components/ui/use-toast";

const GenerateTokenModal = ({ isOpen, onClose, onTokenGenerated }) => {
    const [name, setName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { generateToken } = useAccessTokens();

    const handleGenerate = async () => {
        if (!name) return;
        setIsGenerating(true);
        try {
            const response = await generateToken(name);
            if (response.token) {
                onTokenGenerated(response.token);
            }
        } catch (error) {
            console.error("Failed to generate token:", error);
        } finally {
            setIsGenerating(false);
            setName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Generate New Token</CardTitle>
                    <CardDescription>Give your new token a descriptive name.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        type="text"
                        placeholder="e.g., My Budget App"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleGenerate} disabled={!name || isGenerating}>
                            {isGenerating ? <Loader2 className="animate-spin" /> : "Generate"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ShowTokenModal = ({ token, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!token) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Token Generated Successfully</CardTitle>
                    <CardDescription className="text-red-600 font-semibold">
                        Please copy this token now. You will not be able to see it again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-100 rounded font-mono break-all relative">
                        {token}
                        <Button size="icon" variant="ghost" onClick={handleCopy} className="absolute top-2 right-2 h-8 w-8">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                     {copied && <p className="text-sm text-green-600 text-center">Copied to clipboard!</p>}
                    <div className="text-center">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const TokenList = ({ tokens, onRevoke }) => {
    if (tokens.length === 0) {
        return <p className="text-center text-gray-500 py-8">No API tokens generated yet.</p>;
    }
    return (
        <div className="divide-y divide-gray-200">
            {tokens.map(token => (
                <div key={token.id} className="p-4 flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{token.name}</p>
                        <p className="text-sm text-gray-500 font-mono">
                            {token.token_prefix}... &bull; Created on {new Date(token.created_date).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => onRevoke(token.id)}>Revoke</Button>
                </div>
            ))}
        </div>
    );
};


export default function APIPage() {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generatedToken, setGeneratedToken] = useState(null);

    const { tokens, isLoading, revokeToken, refetch } = useAccessTokens();

    const handleRevoke = async (tokenId) => {
        if (window.confirm("Are you sure you want to revoke this token? This cannot be undone.")) {
            await revokeToken(tokenId);
        }
    };

    const handleTokenGenerated = (token) => {
        setGeneratedToken(token);
        refetch();
    };

    const exampleCurl = "curl -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\" \\\n  https://preview--zil-money-958c34cc.base44.app/functions/api/v1/accounts";

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <KeyRound className="w-8 h-8 text-emerald-600" />
                    API & Integrations
                </h1>
                <Button onClick={() => setShowGenerateModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Generate New Token
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your API Tokens</CardTitle>
                    <CardDescription>Manage access tokens for third-party integrations.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? <p className="text-center py-8">Loading...</p> : <TokenList tokens={tokens} onRevoke={handleRevoke} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Using the API</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Use your generated access token in the Authorization header to access your data.</p>
                    <div className="p-4 bg-gray-900 text-white rounded-lg font-mono text-sm relative">
                        <pre><code>{exampleCurl}</code></pre>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-8 w-8 text-gray-300 hover:text-white"
                            onClick={() => navigator.clipboard.writeText(exampleCurl.replace("YOUR_ACCESS_TOKEN", "YOUR_ACCESS_TOKEN"))}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <GenerateTokenModal
                isOpen={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                onTokenGenerated={handleTokenGenerated}
            />
            <ShowTokenModal
                token={generatedToken}
                onClose={() => setGeneratedToken(null)}
            />
        </div>
    );
}