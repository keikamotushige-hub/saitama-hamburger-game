@echo off
REM Vercel production env setup for saitama-hamburger-game
cd /d "%~dp0"

call npx vercel env rm AUTH_SECRET production --yes 2>nul
call npx vercel env rm OWNER_EMAIL production --yes 2>nul
call npx vercel env rm OWNER_EMAIL_ALIASES production --yes 2>nul
call npx vercel env rm OWNER_PASSWORD production --yes 2>nul
call npx vercel env rm PLAYER1_ID production --yes 2>nul
call npx vercel env rm PLAYER1_PASSWORD production --yes 2>nul
call npx vercel env rm PLAYER1_NAME production --yes 2>nul
call npx vercel env rm PLAYER2_ID production --yes 2>nul
call npx vercel env rm PLAYER2_PASSWORD production --yes 2>nul
call npx vercel env rm PLAYER2_NAME production --yes 2>nul
call npx vercel env rm TEST_ID production --yes 2>nul
call npx vercel env rm TEST_PASSWORD production --yes 2>nul
call npx vercel env rm TEST_NAME production --yes 2>nul

echo saitama-hamburger-game-secret-2026| npx vercel env add AUTH_SECRET production
echo keikamotushiige@gmail.com| npx vercel env add OWNER_EMAIL production
echo keikamotushige@gmail.com| npx vercel env add OWNER_EMAIL_ALIASES production
echo owner2026!| npx vercel env add OWNER_PASSWORD production
echo family1| npx vercel env add PLAYER1_ID production
echo 1111| npx vercel env add PLAYER1_PASSWORD production
echo family1| npx vercel env add PLAYER1_NAME production
echo family2| npx vercel env add PLAYER2_ID production
echo 2222| npx vercel env add PLAYER2_PASSWORD production
echo family2| npx vercel env add PLAYER2_NAME production
echo test| npx vercel env add TEST_ID production
echo test2026| npx vercel env add TEST_PASSWORD production
echo test| npx vercel env add TEST_NAME production

echo Done. Run: npx vercel --prod
