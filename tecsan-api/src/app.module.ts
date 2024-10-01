import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { FazendasModule } from './fazendas/fazendas.module';
import { EstoquesModule } from './estoques/estoques.module';
import { EntradasModule } from './entradas/entradas.module';
import { SaidasModule } from './saidas/saidas.module';
import { TransferenciasModule } from './transferencias/transferencias.module';
import { SaldosModule } from './saldos/saldos.module';
import { InventariosModule } from './inventarios/inventarios.module';

@Module({
  imports: [UsuariosModule, AuthModule, CategoriasModule, ProdutosModule, FazendasModule, EstoquesModule, EntradasModule, SaidasModule, TransferenciasModule, SaldosModule, InventariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
