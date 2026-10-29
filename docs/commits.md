# Четыре коммита
Выполняйте из D:\Tech2. Каждый git add перечисляет только файлы соответствующего этапа.
Если Git еще не инициализирован:
```powershell
git init
git branch -M main
```
1. Данные и структура:
```powershell
git add .gitignore package.json package-lock.json dataset example data images index.html scripts/server.js
git commit -m "feat: add catalog structure and dataset"
```
2. Адаптивные стили:
```powershell
git add scss css
git commit -m "feat: add responsive catalog styles with Sass"
```
3. Поведение и проверки:
```powershell
git add js scripts/catalog.test.js
git commit -m "feat: add catalog filters and tests"
```
4. Документация и результаты проверки:
```powershell
git add README.md docs
git commit -m "docs: add setup verification and delivery instructions"
git status --short
git log --oneline -4
```
Проверка и отправка (замените URL на адрес своего пустого репозитория):
```powershell
npm ci
npm run build
npm test
git status
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```
Если origin уже существует, проверьте git remote -v вместо повторного добавления.
Для PR используйте отдельную ветку и существующую базовую ветку удаленного репозитория; не создавайте PR main в main.

## PR в существующий репозиторий

Этот сценарий применяется в клоне репозитория с уже существующей удаленной main. До четырех коммитов создайте ветку:
```powershell
git switch -c practice-02
```
После четырех коммитов:
```powershell
git push -u origin practice-02
gh pr create --base main --head practice-02 --title "Практическая работа 2: адаптивный каталог на SCSS" --body-file docs/pull-request.md
```
Для gh нужны GitHub CLI и выполненный вход. Без CLI создайте PR в интерфейсе GitHub, выбрав base: main и compare: practice-02; описание возьмите из docs/pull-request.md.

В новом пустом репозитории после отправки четырех коммитов в main PR не требуется: сдавайте ссылку на корень репозитория. Создавайте удаленный репозиторий без README, лицензии и .gitignore, чтобы не получить несвязанные истории.

Все команды приведены для самостоятельного выполнения. Коммиты, push и PR не выполнялись. До каждого git commit можно проверить изменения командой git diff --cached. Этапы 1–2 фиксируют каркас и оформление; полный интерактивный каталог доступен после этапа 3.
