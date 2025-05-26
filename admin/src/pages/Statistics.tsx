import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Statistics.css';

// Componentes
import StatisticsFilters from '../../components/statistics/StatisticsFilters';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import StatisticsTable from '../../components/statistics/StatisticsTable';
import ExportOptions from '../../components/statistics/ExportOptions';

const Statistics = () => {
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dataType: 'users',
    timeRange: 'week',
    groupBy: 'day'
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');

  // Carregar dados estatísticos
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Simular carregamento de dados
        setTimeout(() => {
          // Gerar dados simulados com base nos filtros
          const data = generateMockData(filters);
          setChartData(data.chartData);
          setTableData(data.tableData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [filters]);

  // Gerar dados simulados com base nos filtros
  const generateMockData = (filters) => {
    const { dataType, timeRange, groupBy } = filters;
    
    // Determinar período de tempo
    let days;
    switch (timeRange) {
      case 'day':
        days = 1;
        break;
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 7;
    }
    
    // Determinar intervalo de agrupamento
    let interval;
    switch (groupBy) {
      case 'hour':
        interval = 'hour';
        break;
      case 'day':
        interval = 'day';
        break;
      case 'week':
        interval = 'week';
        break;
      case 'month':
        interval = 'month';
        break;
      default:
        interval = days <= 7 ? 'day' : days <= 30 ? 'week' : 'month';
    }
    
    // Gerar dados para o gráfico
    const chartData = [];
    const now = new Date();
    
    // Ajustar intervalo para gerar pontos de dados apropriados
    let points;
    let intervalMs;
    
    if (interval === 'hour') {
      points = days * 24;
      intervalMs = 60 * 60 * 1000; // 1 hora
    } else if (interval === 'day') {
      points = days;
      intervalMs = 24 * 60 * 60 * 1000; // 1 dia
    } else if (interval === 'week') {
      points = Math.ceil(days / 7);
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 semana
    } else {
      points = Math.ceil(days / 30);
      intervalMs = 30 * 24 * 60 * 60 * 1000; // 1 mês (aproximado)
    }
    
    // Gerar pontos de dados
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * intervalMs));
      
      // Formatar data conforme o intervalo
      let label;
      if (interval === 'hour') {
        label = `${date.getHours()}:00`;
      } else if (interval === 'day') {
        label = `${date.getDate()}/${date.getMonth() + 1}`;
      } else if (interval === 'week') {
        label = `Semana ${Math.ceil(date.getDate() / 7)}`;
      } else {
        label = `${date.getMonth() + 1}/${date.getFullYear()}`;
      }
      
      // Gerar valores simulados com base no tipo de dados
      let value;
      let secondaryValue;
      
      switch (dataType) {
        case 'users':
          // Usuários ativos
          value = Math.floor(1000 + Math.random() * 500 * Math.sin(i / 2));
          // Novos registros
          secondaryValue = Math.floor(value * 0.1 + Math.random() * 50);
          break;
        case 'content':
          // Clipes enviados
          value = Math.floor(500 + Math.random() * 300 * Math.sin(i / 3));
          // Clipes reportados
          secondaryValue = Math.floor(value * 0.05 + Math.random() * 20);
          break;
        case 'minigames':
          // Partidas jogadas
          value = Math.floor(2000 + Math.random() * 1000 * Math.sin(i / 2.5));
          // PRYSMS ganhos
          secondaryValue = Math.floor(value * 5 + Math.random() * 1000);
          break;
        case 'economy':
          // PRYSMS gerados
          value = Math.floor(10000 + Math.random() * 5000 * Math.sin(i / 3));
          // PRYSMS gastos
          secondaryValue = Math.floor(value * 0.7 + Math.random() * 2000);
          break;
        default:
          value = Math.floor(1000 + Math.random() * 500);
          secondaryValue = Math.floor(value * 0.2);
      }
      
      chartData.push({
        label,
        date: date.toISOString(),
        value,
        secondaryValue
      });
    }
    
    // Gerar dados para a tabela
    const tableData = [];
    
    // Adicionar linha de totais
    const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
    const totalSecondaryValue = chartData.reduce((sum, item) => sum + item.secondaryValue, 0);
    
    tableData.push({
      label: 'Total',
      value: totalValue,
      secondaryValue: totalSecondaryValue
    });
    
    // Adicionar linha de média
    tableData.push({
      label: 'Média',
      value: Math.floor(totalValue / chartData.length),
      secondaryValue: Math.floor(totalSecondaryValue / chartData.length)
    });
    
    // Adicionar linha de máximo
    tableData.push({
      label: 'Máximo',
      value: Math.max(...chartData.map(item => item.value)),
      secondaryValue: Math.max(...chartData.map(item => item.secondaryValue))
    });
    
    // Adicionar linha de mínimo
    tableData.push({
      label: 'Mínimo',
      value: Math.min(...chartData.map(item => item.value)),
      secondaryValue: Math.min(...chartData.map(item => item.secondaryValue))
    });
    
    return {
      chartData,
      tableData
    };
  };

  // Manipuladores de eventos
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleExportData = () => {
    // Em um ambiente de produção, isso geraria um arquivo para download
    console.log(`Exportando dados em formato ${exportFormat}`);
    
    // Simulação de download
    const dataStr = JSON.stringify(chartData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `prysmsclips_${filters.dataType}_${filters.timeRange}_${new Date().toISOString().split('T')[0]}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `${exportName}.${exportFormat}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obter rótulos para os dados com base no tipo selecionado
  const getDataLabels = () => {
    switch (filters.dataType) {
      case 'users':
        return {
          primary: 'Usuários Ativos',
          secondary: 'Novos Registros'
        };
      case 'content':
        return {
          primary: 'Clipes Enviados',
          secondary: 'Clipes Reportados'
        };
      case 'minigames':
        return {
          primary: 'Partidas Jogadas',
          secondary: 'PRYSMS Ganhos'
        };
      case 'economy':
        return {
          primary: 'PRYSMS Gerados',
          secondary: 'PRYSMS Gastos'
        };
      default:
        return {
          primary: 'Valor Primário',
          secondary: 'Valor Secundário'
        };
    }
  };

  const dataLabels = getDataLabels();

  if (loading) {
    return <div className="statistics-loading">Carregando estatísticas...</div>;
  }

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h1>Estatísticas e Análises</h1>
        <p className="statistics-description">
          Visualize e analise dados de desempenho da plataforma PRYSMSCLIPS.
        </p>
      </div>

      <StatisticsFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="statistics-content">
        <div className="statistics-chart-container">
          <h2>{dataLabels.primary} vs {dataLabels.secondary}</h2>
          <StatisticsChart 
            data={chartData}
            primaryLabel={dataLabels.primary}
            secondaryLabel={dataLabels.secondary}
            timeRange={filters.timeRange}
            groupBy={filters.groupBy}
          />
        </div>

        <div className="statistics-table-container">
          <h2>Resumo</h2>
          <StatisticsTable 
            data={tableData}
            primaryLabel={dataLabels.primary}
            secondaryLabel={dataLabels.secondary}
          />
        </div>
      </div>

      <div className="statistics-export">
        <ExportOptions 
          format={exportFormat}
          onFormatChange={setExportFormat}
          onExport={handleExportData}
        />
      </div>
    </div>
  );
};

export default Statistics;
