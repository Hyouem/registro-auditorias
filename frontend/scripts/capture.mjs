import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1536,height:1000},deviceScaleFactor:1});
 await page.goto('http://localhost:5198',{waitUntil:'networkidle'});
 const data=["Revisão de acesso", "Equipe de segurança", "APPROVED"];
 for(let i=0;i<data.length;i++) await page.locator('form input').nth(i).fill(data[i]);
 const created=page.waitForResponse(r=>r.url().endsWith('/api/entries') && r.request().method()==='POST');
 await page.getByRole('button',{name:'Adicionar registro'}).click();
 if((await created).status()!==201) throw Error('POST frontend falhou');
 await page.reload({waitUntil:'networkidle'});
 await page.locator('article').filter({hasText:data[0]}).first().waitFor({timeout:15000});
 mkdirSync('docs/images',{recursive:true});
 await page.screenshot({path:'docs/images/funcionamento.png',fullPage:true});
 console.log('Captura real concluída');
} finally {await browser.close();}
