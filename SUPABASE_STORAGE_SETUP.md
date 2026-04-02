# Configuração do Bucket 'evidencias' no Supabase

Para garantir que o sistema de auditoria consiga salvar as fotos corretamente, precisamos garantir que o bucket existam e que as políticas de segurança permitam o upload público (anon).

### SQL para Executar no Editor do Supabase

Copie e cole o código abaixo no [SQL Editor](https://supabase.com/dashboard/project/gackvwuokitcfvkrgngt/sql) do seu projeto:

```sql
-- 1. Criar o bucket 'evidencias' caso ele não exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidencias', 'evidencias', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir Upload Público (Anon)
-- Nota: Isso permite que o formulário suba arquivos para a pasta 'auditoria/'
CREATE POLICY "Permitir Upload de Auditoria"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'evidencias'
);

-- 3. Permitir Visualização Pública
-- Nota: Isso gera as URLs públicas que serão salvas na planilha
CREATE POLICY "Permitir Visualização Pública"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'evidencias'
);
```

### O que isso faz:
1. **Criação:** Garante que o container `evidencias` exista no Storage.
2. **Upload:** Define uma política no banco de dados (RLS) que autoriza usuários não autenticados (a chave `anon` do código) a inserirem arquivos.
3. **Visualização:** Torna os arquivos acessíveis via URL pública para que o Google Sheets consiga exibir os links corretamente.

### Verificação
Após rodar o SQL, tente enviar um formulário. Se as imagens aparecerem no bucket `evidencias/auditoria/`, a configuração está correta.
