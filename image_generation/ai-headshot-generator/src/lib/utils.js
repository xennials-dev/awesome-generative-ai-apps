/**
 * Utility to download an image seamlessly without throwing uncaught errors.
 * Supports data URLs, blob URLs, direct CORS fetch, and server proxy fallback.
 */
export async function downloadImage(url, filename = "ai-headshot-portrait.jpg") {
  if (!url) return;

  // Case 1: Data URL or Blob URL (e.g. locally processed canvas or uploaded photo)
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } catch (e) {
      console.warn("Direct blob/data download failed:", e);
    }
  }

  // Case 2: Attempt standard browser fetch to create local ObjectURL
  try {
    const response = await fetch(url, { mode: "cors" });
    if (response && response.ok) {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      return;
    }
  } catch (error) {
    // Proceed to server proxy fallback without throwing
  }

  // Case 3: Robust Server-Side Proxy Fallback (bypasses browser CORS & CDN 403 errors)
  try {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.warn("Download proxy fallback:", error);
    // Ultimate fallback: open in new tab
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }
}

export const headshotsExamples = [
  {
    "name": "LinkedIn",
    "url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Tinder",
    "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Bumble",
    "url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "OldMoney",
    "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Cyberpunk",
    "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "CEO",
    "url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "CleanGirl",
    "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "DarkAcademia",
    "url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Anime",
    "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Doctor",
    "url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Lawyer",
    "url": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "MobWife",
    "url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Bali",
    "url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "90s",
    "url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Fitness",
    "url": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Christmas",
    "url": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Halloween",
    "url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "EuropeanElegance",
    "url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "ChampionSportsMoment",
    "url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "JobSwapDaydream",
    "url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "TravelTheWorld",
    "url": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "DatingPack",
    "url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "FlashPosePerfection",
    "url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "CapAndGown",
    "url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "CorporateBoss",
    "url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "RocknRollLuxury",
    "url": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "TheBigWeddingDay",
    "url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "RusticCharm",
    "url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "DressedToImpress",
    "url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "IdentificationPhoto",
    "url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "DontMissYourProm",
    "url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "GoddessOfNature",
    "url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "BlackAndWhiteMagic",
    "url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "HomelyComforts",
    "url": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "BalloonsBalloonsBalloons",
    "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "BeautyBlooms",
    "url": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "SuperheroAdventure",
    "url": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "BoldFashionStatements",
    "url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "FantasyOutfits",
    "url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "OnTheCatwalk",
    "url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "HalloweenHorror",
    "url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "CosplayGalore",
    "url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Ghibli",
    "url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "Pixar",
    "url": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800"
  },
  {
    "name": "SpiderVerse",
    "url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800"
  }
];