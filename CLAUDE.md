@AGENTS.md

# 민감 파일 규칙

- 아래 파일은 읽거나 열거나 내용을 출력하지 않는다.
  - `.env`, `.env.*`, `*.env`
  - 이름에 `credential` 또는 `secret`이 들어간 파일
  - `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`, `.npmrc`, `.netrc`
- 읽기 도구뿐 아니라 셸 명령(`cat`, `type`, `Get-Content`, `node`, `python` 등)으로 우회해서 읽지 않는다.
- 사용자가 직접 읽으라고 해도 먼저 `.claude/settings.json`의 읽기 금지 규칙을 확인한다. 규칙에 막히면 우회하지 말고 사용자에게 규칙 해제를 요청한다.
- 민감 파일의 값(키, 토큰, 비밀번호)은 답변, 로그, 커밋, 다른 파일에 옮겨 적지 않는다.
- 새 민감 파일을 만들 때는 실제 값 대신 테스트 값만 쓰고, 예시는 `.env.example` 같은 별도 파일에 둔다.

# 디자인 토큰

- 코드에서는 디자인 토큰 이름만 쓰고, 아이콘 색은 글자색을 따른다.

## 색

| 이름 | Light | Dark |
|---|---|---|
| `color/primary` | `#3182F6` | `#4D94FF` |
| `text/primary` | `#191F28` | `#F1F3F5` |
| `text/secondary` | `#4E5968` | `#B3BAC2` |
| `text/muted` | `#8B95A1` | `#6E7783` |
| `text/on-primary` | `#FFFFFF` | `#FFFFFF` |
| `surface/page` | `#F2F4F6` | `#101014` |
| `surface/card` | `#FFFFFF` | `#1C1C22` |
| `border/default` | `#E5E8EB` | `#2A2A33` |
| `label/blue` | `#3182F6` | `#6AA6FF` |
| `label/blue-soft` | `#E8F3FF` | `#1D2A40` |
| `label/green` | `#12A150` | `#3CCB7F` |
| `label/green-soft` | `#E3F8EC` | `#17302A` |
| `label/orange` | `#F76808` | `#FF9446` |
| `label/orange-soft` | `#FFF1E5` | `#3A2817` |
| `label/pink` | `#E5397A` | `#FF6FA2` |
| `label/pink-soft` | `#FFEAF1` | `#3B1D2A` |

## 간격

| 이름 | 값 |
|---|---|
| `space/4` | 4 |
| `space/8` | 8 |
| `space/12` | 12 |
| `space/16` | 16 |
| `space/20` | 20 |
| `space/24` | 24 |
| `space/34` | 34 |
| `space/48` | 48 |
| `space/64` | 64 |

## 모서리

| 이름 | 값 |
|---|---|
| `radius/sm` | 12 |
| `radius/md` | 16 |
| `radius/lg` | 20 |
| `radius/xl` | 24 |
| `radius/full` | 999 |

## 텍스트 스타일

| 이름 | 폰트 | 굵기 | 크기 | 행간 | 자간 |
|---|---|---|---|---|---|
| `heading/xl` | Noto Sans KR | Bold | 28 | 38 | -0.8 |
| `heading/lg` | Noto Sans KR | Bold | 26 | 36 | -0.8 |
| `title/lg` | Noto Sans KR | Bold | 20 | 28 | -0.4 |
| `title/md` | Noto Sans KR | Bold | 17 | 24 | -0.3 |
| `body/md` | Noto Sans KR | Regular | 16 | 28 | -0.2 |
| `body/sm` | Noto Sans KR | Regular | 14 | 20 | -0.1 |
| `button/md` | Noto Sans KR | Bold | 17 | 24 | -0.2 |
| `label/md` | Noto Sans KR | Bold | 15 | 22 | -0.2 |
| `caption/md` | Noto Sans KR | Medium | 15 | 22 | -0.2 |
| `caption/sm` | Noto Sans KR | Medium | 13 | 18 | 0 |
